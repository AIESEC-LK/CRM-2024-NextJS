import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("Entities").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records deleted" });
  } catch (e) {
    console.error("Error deleting entity:", e);
    return NextResponse.json({ error: "Failed to delete entity" }, { status: 500 });
  }
}
