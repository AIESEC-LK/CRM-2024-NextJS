import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { id, industryName } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("Industries").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          industryName,
        }
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records updated" });
  } catch (e) {
    console.error("Error updating industry:", e);
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}
