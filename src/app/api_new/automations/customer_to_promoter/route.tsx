import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with actual DB name if needed
    const prospects = db.collection("Prospects");

    const now = new Date();
    const newDateExpires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    console.log("Current time (UTC):", now.toISOString());

    // Optional: Find matching docs first for verification
    const matchingDocs = await prospects.find({
      status: "customer",
      date_expires: { $lte: now },
    }).toArray();
    console.log("Matching documents count:", matchingDocs.length);

    const result = await prospects.updateMany(
      {
        status: "customer",
        date_expires: { $lte: now },
      },
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
