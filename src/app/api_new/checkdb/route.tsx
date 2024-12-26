import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        return new NextResponse('Connected');
    } catch (error) {
        console.log(error);
        return new NextResponse('Could not connect', { status: 500 });
    }
}