import express, { Request, Response } from "express";
import db from "@repo/db/client";
import { hdfcWebhookSchema } from "./zod/hdfcWebhookSchema";

const app = express();
app.use(express.json())

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
    // TODO: Add zod validation here? -> done
    // TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    // TODO: Check if this onRampTxn is processing or not -> done

    // console.log("Webhook received:", req.body);
    const parsed = hdfcWebhookSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid request body"
        });
    }

    // console.log("Processing payment:", paymentInformation);
    const { token, user_identifier, amount} = parsed.data;
    const userId = Number(user_identifier);
    const amountNum = Number(amount)

    try {
        const transaction = await db.onRampTransaction.findUnique({
            where: { token }
        });

        if (!transaction) {
            return res.status(400).json({
                message: "Invalid token"
            });
        }

        if (transaction.userId !== userId) {
            return res.status(400).json({
                message: "User mismatch"
            });
        }

        if (transaction.amount !== amountNum) {
            return res.status(400).json({
                message: "Amount mismatch"
            });
        }

        if (transaction.status !== "Processing") {
            return res.status(200).json({
                message: "Already Processed or not processing"
            });
        }

        await db.$transaction([
            db.balance.upsert({
                where: {
                    userId
                },
                update: {
                    amount: {
                        increment: amountNum
                    }
                },
                create: {
                    userId,
                    amount: amountNum,
                    locked: 0
                }
            }),

            db.onRampTransaction.update({
                where: {
                    token
                },
                data: {
                    status: "Success"
                }
            })
        ]);

        // console.log("Transaction successful:", result);

        res.status(200).json({
            message: "captured"
        })
    } catch (err) {
        console.error("Webhook error:", err);
        res.status(500).json({
            message: "Error while processing webhook"
        });
    }
});

app.listen(3003);