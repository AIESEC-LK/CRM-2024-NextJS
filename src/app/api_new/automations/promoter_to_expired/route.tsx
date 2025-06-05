import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const prospects = db.collection("Prospects");
    const deletedProspects = db.collection("Deleted_Prospects");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // e.g., "2025-06-05"

    // ✅ Step 1: Fetch all prospects with date_expires
    const allExpirableProspects = await prospects.find({
      status: { $in: ["prospect", "lead", "promoter"] },
      date_expires: { $exists: true, $ne: null }
    }).toArray();

    // ✅ Step 2: Filter only expired ones
    const expiredProspects = allExpirableProspects.filter((p) => {
      const expiresDate = new Date(p.date_expires);
      const expiresStr = expiresDate.toISOString().split("T")[0];
      return expiresStr <= todayStr;
    });

    if (expiredProspects.length === 0) {
      return NextResponse.json({
        message: "No expired prospects found.",
        movedCount: 0,
      });
    }

    // ✅ Step 3: Prepare for archiving
    const expiredWithStatus = expiredProspects.map((p) => ({
      ...p,
      status: "expired",
      archived_at: new Date(),
    }));

    // ✅ Step 4: Insert into Deleted_Prospects
    await deletedProspects.insertMany(expiredWithStatus);

    // ✅ Step 5: Delete from original Prospects collection
    const idsToDelete = expiredProspects.map((p) => new ObjectId(p._id));
    const deleteResult = await prospects.deleteMany({ _id: { $in: idsToDelete } });

    return NextResponse.json({
      message: "Expired prospects moved to Deleted_Prospects successfully.",
      movedCount: expiredWithStatus.length,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error archiving expired prospects:", error);
    return NextResponse.json(
      { message: "Failed to archive expired prospects", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
