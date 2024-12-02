import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// Handling GET request to fetch a prospect by ID
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

// Handling DELETE request to delete a prospect and move it to the relevant collection
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    const { id } = params;

    console.log("Deleting prospect request with id:", id);

    // Find the prospect request in the "Pending_Prospects" collection
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

    // Determine the target collection based on status
    const targetCollection =
      prospectRequest.status === "approved"
        ? "Approved_Prospects"
        : prospectRequest.status === "declined"
        ? "Declined_Prospects"
        : null;

    if (!targetCollection) {
      return NextResponse.json(
        { error: "Invalid status for the prospect request" },
        { status: 400 }
      );
    }

    // Perform the atomic operation: delete from the "Pending_Prospects" collection and insert into the appropriate collection
    const session = client.startSession();
    session.startTransaction();

    try {
      // Move the document to the target collection
      await db
        .collection(targetCollection)
        .insertOne(prospectRequest, { session });

      // Delete the prospect from the "Pending_Prospects" collection
      await db
        .collection("Pending_Prospects")
        .deleteOne({ _id: new ObjectId(id) }, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      console.log(
        "Prospect successfully deleted and moved to the",
        targetCollection
      );
      return NextResponse.json({
        message: "Prospect successfully deleted and moved",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error during transaction:", error);
      return NextResponse.json(
        { error: "Failed to delete and move the prospect" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Error deleting prospect request:", e);
    return NextResponse.json(
      { error: "Failed to delete prospect request", details: e.message },
      { status: 500 }
    );
  }
}
