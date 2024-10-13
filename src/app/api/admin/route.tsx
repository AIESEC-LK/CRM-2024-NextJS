import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    const requests = await db.collection("Users").find({}).toArray();

    return NextResponse.json(requests);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();
    const client = await clientPromise;
    const db = client.db("CRM");

    const result = await db
      .collection("Users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
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
