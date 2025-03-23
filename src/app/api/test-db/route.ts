import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Simple query to test connection

        const userCount = await prisma.user.count();
        return NextResponse.json({message: 'Database connected successfully', userCount})
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            {
                error: 'Failed to connect to database',
                details: error
            },
            {status: 500}
        )
    }
}