import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const ALLOWED_FIELDS = [
  "company_id",
  "product_type_id",
  "entity_id",
  "date_added",
  "date_expires",
  "contactPersonName",
  "contactPersonNumber",
  "contactPersonEmail",
  "status",
  "lead_proof_url",
  "activities",
  "partnershipType",
  "mouStartDate",
  "mouEndDate",
];

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Filter out fields that are not allowed
    const updateFields: { [key: string]: any } = {};
    for (const key in updates) {
      if (ALLOWED_FIELDS.includes(key) && updates[key] !== undefined) {
        updateFields[key] = updates[key];
      }
    }

    // Conditionally add the amount field if partnershipType is monetary
    if (updates.partnershipType === 'monetary' && updates.amount !== undefined) {
      updateFields.amount = updates.amount;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const result = await db.collection("Prospects").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "No documents were modified" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}