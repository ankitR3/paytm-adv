import { NextRequest, NextResponse } from "next/server"
import db from "@repo/db";
import bcrypt from "bcrypt";

export const GET = async () => {
    const hashedPassword = await bcrypt.hash("mypassword", 10);

    await db.user.create({
        data: {
            email: "asd",
            name: "adsads",
            number: "1234567890",
            password: hashedPassword
        }
    });

    return NextResponse.json({
        message: "User created successfully"
    })
}