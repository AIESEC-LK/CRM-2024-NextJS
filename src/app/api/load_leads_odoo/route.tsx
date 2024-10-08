// src/app/api/load_leads/route.tsx
import { odooRetrieve } from "@/app/lib/odooRetrive";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await odooRetrieve();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
