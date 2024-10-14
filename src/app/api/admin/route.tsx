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
    console.log(`Attempting to update request ${id} to status ${status}`);

    if (!ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId: ${id}`);
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CRM");

    const result = await db
      .collection("Users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });

    console.log(`Update result: ${JSON.stringify(result)}`);

    if (result.matchedCount === 0) {
      console.log(`No document found with id ${id}`);
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      console.log(
        `Document found but not modified. Current status might already be ${status}`
      );
      return NextResponse.json({ success: true, message: "No changes made" });
    }

    console.log(`Successfully updated request ${id} to status ${status}`);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error updating request:", e);
    return NextResponse.json(
      { error: "Failed to update request", details: e.message },
      { status: 500 }
    );
  }
}
