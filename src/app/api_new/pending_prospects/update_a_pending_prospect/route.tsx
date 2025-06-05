import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
        const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret

    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    
    
    );
    
  }




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
