
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = NextResponse.next();
    response.cookies.delete('user');
    return response;
}