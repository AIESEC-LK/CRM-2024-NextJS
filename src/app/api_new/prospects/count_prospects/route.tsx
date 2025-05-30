import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { MAX_PROSPECTS } from "@/app/lib/values";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {

            const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }
    // Parse URL parameters
    const { searchParams } = new URL(req.url);
    const userLcId = searchParams.get("userLcId");

    if (!userLcId) {
      return NextResponse.json({ error: "Invalid userLcId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Count prospects where userLcId matches and status is 'prospect'
    const prospectCount = await db.collection("Prospects").countDocuments({
      userLcId,
      status: "prospect",
    });

    // Determine if prospect count is within limit
    const result = prospectCount < MAX_PROSPECTS;

    return NextResponse.json({ result }, { status: 200 });
  } catch (e) {
    console.error("Error fetching prospect count:", e);

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch prospect count" },
      { status: 500 }
    );
  }
}