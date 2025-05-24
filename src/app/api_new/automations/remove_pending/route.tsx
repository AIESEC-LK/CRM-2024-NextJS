import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with your DB name if not in env

    const pendingProspects = db.collection("Pending_Prospects");

    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

    // STEP 1: Fetch all pending prospects
    const allPending = await pendingProspects.find().toArray();

    // STEP 2: Filter those where date_added is <= two weeks ago
    const expiredPending = allPending.filter((prospect) => {
      if (!prospect.date_added) return false;
      const addedDate = new Date(prospect.date_added);
      return addedDate <= twoWeeksAgo;
    });

    if (expiredPending.length === 0) {
      return NextResponse.json({
        message: "No outdated pending prospects found.",
        deletedCount: 0,
      });
    }

    // STEP 3: Delete them
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
