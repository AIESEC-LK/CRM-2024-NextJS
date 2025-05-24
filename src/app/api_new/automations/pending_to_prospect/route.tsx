import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with actual DB name
    const prospects = db.collection("Prospects");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // "2025-05-24"
    const newDateExpires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Step 1: Fetch all prospects
    const allProspects = await prospects.find().toArray();

    // Step 2: Filter those to be updated
    const prospectIdsToUpdate = allProspects
      .filter((prospect) => {
        if (!prospect.date_expires || prospect.status !== "customer") return false;
        const dateExpires = new Date(prospect.date_expires);
        const expiresStr = dateExpires.toISOString().split("T")[0];
        return expiresStr <= todayStr;
      })
      .map((p) => new ObjectId(p._id)); // Ensure _id is properly cast

    if (prospectIdsToUpdate.length === 0) {
      return NextResponse.json({
        message: "No matching prospects found for update.",
        matchedCount: 0,
        modifiedCount: 0,
      });
    }

    // Step 3: Update matching prospects
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
      { message: "Failed to update prospects", error: error },
      { status: 500 }
    );
  }
}
