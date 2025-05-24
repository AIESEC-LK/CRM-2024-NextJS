import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Replace with your DB name if needed
    const prospects = db.collection("Prospects");

    const now = new Date(); // Current timestamp
    const newDateExpires = new Date();
    newDateExpires.setDate(now.getDate() + 14); // Add 14 days

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
