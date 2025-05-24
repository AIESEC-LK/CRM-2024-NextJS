import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace if needed
    const prospects = db.collection("Prospects");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // e.g., "2025-05-24"
    const newDateExpires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // STEP 1: Fetch all prospects
    const allProspects = await prospects.find().toArray();

    // STEP 2: Filter those to be updated
    const prospectIdsToUpdate = allProspects
      .filter((prospect) => {
        const dateExpires = new Date(prospect.date_expires);
        const expiresStr = dateExpires.toISOString().split("T")[0]; // e.g., "2025-05-23"
        return prospect.status === "customer" && expiresStr <= todayStr;
      })
      .map((p) => p._id);

    if (prospectIdsToUpdate.length === 0) {
      return NextResponse.json({
        message: "No matching prospects found for update.",
        matchedCount: 0,
        modifiedCount: 0,
      });
    }

    // STEP 3: Update matching prospects
    const result = await prospects.updateMany(
      { _id: { $in: prospectIdsToUpdate } },
      {
        $set: {
          status: "promoter",
          date_expires: newDateExpires,
        },
      }
    );

    return NextResponse.json({
      message: "Prospects updated successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating prospects:", error);
    return NextResponse.json(
      { message: "Failed to update prospects", error },
      { status: 500 }
    );
  }
}
