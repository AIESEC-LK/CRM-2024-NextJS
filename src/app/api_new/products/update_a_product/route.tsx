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



    const { id, productName, product,abbravation, proof_url } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("Products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          productName,
          abbravation,
          proof_url,
          product
        }
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records updated" });
  } catch (e) {
    console.error("Error updating product:", e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
