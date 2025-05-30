import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
export const dynamic = "force-dynamic";

export async function GET(req:NextRequest) {
  try {


            const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const requests = await db.collection("Industries").find({}).toArray();

    return NextResponse.json(requests);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}