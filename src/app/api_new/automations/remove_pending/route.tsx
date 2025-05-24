import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with actual DB name if needed

    const pendingProspects = db.collection("Pending_Prospects");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // "2025-05-24"

    // Step 1: Fetch all pending prospects
    const allPending = await pendingProspects.find().toArray();

    // Step 2: Filter expired ones
    const expiredPending = allPending.filter((prospect) => {
      if (!prospect.expire_date) return false;
      const expiresDate = new Date(prospect.expire_date);
      const expiresStr = expiresDate.toISOString().split("T")[0];
      return expiresStr <= todayStr;
    });

    if (expiredPending.length === 0) {
      return NextResponse.json({
        message: "No expired pending prospects found.",
        deletedCount: 0,
      });
    }

    // Step 3: Delete them
    const idsToDelete = expiredPending.map((p) => new ObjectId(p._id));
    const deleteResult = await pendingProspects.deleteMany({
      _id: { $in: idsToDelete },
    });

    return NextResponse.json({
      message: "Expired pending prospects deleted successfully.",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting expired pending prospects:", error);
    return NextResponse.json(
      { message: "Failed to delete expired pending prospects", error: error },
      { status: 500 }
    );
  }
}
