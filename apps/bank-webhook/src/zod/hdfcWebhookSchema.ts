import zod from "zod";

export const hdfcWebhookSchema = zod.object({
    token: zod.string().min(1),
    user_identifier: zod.number(),
    amount: zod.string().min(1)
});