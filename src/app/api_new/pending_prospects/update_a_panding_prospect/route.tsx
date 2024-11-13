import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { id, company_id, product_type_id,  entity_id, date_added, date_expires} = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("Pending_Prospects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          company_id, 
          product_type_id,  
          entity_id, 
          date_added, 
          date_expires
        }
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records updated" });
  } catch (e) {
    console.error("Error updating pending prospect:", e);
    return NextResponse.json({ error: "Failed to update pending prospect" }, { status: 500 });
  }
}
