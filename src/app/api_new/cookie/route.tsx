// app/api_new/cookie/route.tsx
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.cookies.get("email");
  return NextResponse.json({ email: email?.value });
}