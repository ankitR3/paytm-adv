import { NextResponse } from "next/server"
import prisma from "@repo/db/client";

export const GET = async () => {
    await prisma.user.create({
        data: {
            email: "asd",
            name: "adsads",
            number: "1234567890",
            password: "my-password"
        },
    });

    return NextResponse.json({
        message: "hi there"
    });
};