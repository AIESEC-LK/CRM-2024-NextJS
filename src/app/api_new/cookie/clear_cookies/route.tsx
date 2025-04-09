
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const response = NextResponse.json({ message: "Cookies cleared" });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('redirect_uri');
    return response;
}