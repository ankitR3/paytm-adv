import express, { Request, Response } from "express";
import db from "@repo/db/client";

const app = express();
app.use(express.json())

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
    // console.log("Webhook received:", req.body);

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string;
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    // console.log("Processing payment:", paymentInformation);

    try {
        const result = await db.$transaction([
            db.balance.upsert({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                update: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                },
                create: {
                    userId: Number(paymentInformation.userId),
                    amount: Number(paymentInformation.amount),
                    locked: 0
                }
            }),

            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token,
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
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(3003);