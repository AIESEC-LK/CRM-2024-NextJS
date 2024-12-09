import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    const { id } = params;

    console.log("Fetching prospect request with id:", id);

    const prospectRequest = await db.collection("Pending_Prospects").findOne({
      _id: new ObjectId(id),
    });

    if (!prospectRequest) {
      console.log("Prospect request not found for id:", id);
      return NextResponse.json(
        { error: "Prospect request not found" },
        { status: 404 }
      );
    }

    console.log("Prospect request found:", prospectRequest);
    return NextResponse.json(prospectRequest);
  } catch (e) {
    console.error("Error fetching prospect request:", e);
    return NextResponse.json(
      { error: "Failed to fetch prospect request", details: e.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    const { id } = params;

    console.log("Updating prospect status for id:", id);

    const { status } = await request.json();

    if (!["approved", "declined"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const prospectRequest = await db.collection("Pending_Prospects").findOne({
      _id: new ObjectId(id),
    });

    if (!prospectRequest) {
      return NextResponse.json(
        { error: "Prospect request not found" },
        { status: 404 }
      );
    }

    await db
      .collection("Pending_Prospects")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    const targetCollection =
      status === "approved" ? "Prospects" : "Declined_Prospects";

    const session = client.startSession();
    session.startTransaction();

    try {
      await db
        .collection(targetCollection)
        .insertOne({ ...prospectRequest, status }, { session });

      await db
        .collection("Pending_Prospects")
        .deleteOne({ _id: new ObjectId(id) }, { session });

      await session.commitTransaction();
      session.endSession();

      console.log(`Prospect successfully moved to ${targetCollection}`);
      return NextResponse.json({
        message: `Prospect successfully moved to ${targetCollection}`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error during transaction:", error);
      return NextResponse.json(
        {
          error: "Failed to move and delete the prospect",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Error updating prospect status:", e);
    return NextResponse.json(
      { error: "Failed to update prospect status", details: e.message },
      { status: 500 }
    );
  }
}
