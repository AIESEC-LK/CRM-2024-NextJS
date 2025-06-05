import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with your DB name if not in env

    const pendingProspects = db.collection("Pending_Prospects");

    const now = new Date();

    // STEP 1: Fetch all pending prospects where date_expires is less than or equal to now
    const expiredPending = await pendingProspects.find({
      date_expires: { $lte: now }
    }).toArray();

    if (expiredPending.length === 0) {
      return NextResponse.json({
        message: "No outdated pending prospects found.",
        deletedCount: 0,
      });
    }

    // STEP 2: Delete them
    const idsToDelete = expiredPending.map((p) => new ObjectId(p._id));
    const deleteResult = await pendingProspects.deleteMany({
      _id: { $in: idsToDelete },
    });

    return NextResponse.json({
      message: "Outdated pending prospects deleted successfully.",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting outdated pending prospects:", error);
    return NextResponse.json(
      { message: "Failed to delete outdated pending prospects", error: error },
      { status: 500 }
    );
  }
}
