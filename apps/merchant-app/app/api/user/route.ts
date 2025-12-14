import { NextResponse } from "next/server"
import prisma from "@repo/db/client";

export async function GET() {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const body = await req.json();

    const user = await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            number: body.number,
            password: body.password,
        },
    });

    return NextResponse.json(user);
};