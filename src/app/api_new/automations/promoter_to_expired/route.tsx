import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace if needed

    const prospects = db.collection("Prospects");
    const deletedProspects = db.collection("Deleted_Prospects");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // e.g., "2025-05-24"

    // Step 1: Fetch all promoter prospects
    const promoterProspects = await prospects.find({ status: "promoter" }).toArray();

    const expiredProspects = promoterProspects.filter((prospect) => {
      if (!prospect.date_expires) return false;
      const expiresDate = new Date(prospect.date_expires);
      const expiresStr = expiresDate.toISOString().split("T")[0];
      return expiresStr <= todayStr;
    });

    if (expiredProspects.length === 0) {
      return NextResponse.json({
        message: "No expired promoter prospects found.",
        movedCount: 0,
      });
    }

    // Step 2: Prepare and insert into Deleted_Prospects
    const expiredWithStatus = expiredProspects.map((p) => ({
      ...p,
      status: "expired",
    }));

    await deletedProspects.insertMany(expiredWithStatus);

    // Step 3: Remove from original Prospects collection
    const idsToDelete = expiredProspects.map((p) => new ObjectId(p._id));
    const deleteResult = await prospects.deleteMany({ _id: { $in: idsToDelete } });

    return NextResponse.json({
      message: "Expired promoter prospects moved to Deleted_Prospects successfully.",
      movedCount: expiredWithStatus.length,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error archiving expired prospects:", error);
    return NextResponse.json(
      { message: "Failed to archive expired prospects", error: error },
      { status: 500 }
    );
  }
}
