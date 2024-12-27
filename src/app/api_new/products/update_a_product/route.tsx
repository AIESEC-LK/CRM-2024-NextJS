import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { id, productName, abbravation, proof_url } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("Products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          productName,
          abbravation,
          proof_url
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
