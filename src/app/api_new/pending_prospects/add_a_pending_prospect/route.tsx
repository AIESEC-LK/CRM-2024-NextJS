import clientPromise from "@/app/lib/mongodb";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

        const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }

    const { company_id, product_type_id, entity_id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Set current date as the date added
    const dateAdded = new Date();

    // Set date expires to three months from now
    const dateExpires = new Date();
    dateExpires.setMonth(dateExpires.getMonth() + 3);

    const result = await db.collection("Pending_Prospects").insertOne({
      company_id: company_id,
      product_type_id: product_type_id,
      entity_id: entity_id,
      date_added: dateAdded,
      date_expires: dateExpires,
      status: PROSPECT_VALUES[1].value 
    });

    if (result.insertedId) {
      return NextResponse.json({ success: true, id: result.insertedId });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error updating request:", e);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
