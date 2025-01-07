
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const full_name = request.cookies.get("full_name");
  return NextResponse.json({ full_name: full_name?.value });
}