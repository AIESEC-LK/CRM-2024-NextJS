import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { PROMOTER_EVENT_EXPIRE_TIME_DURATION, PROMOTER_PRODUCT_EXPIRE_TIME_DURATION } from "@/app/lib/values";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const prospects = db.collection("Prospects");
    const products = db.collection("Products");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // e.g., "2025-05-26"

    // Fetch the "Event" product
    const eventProduct = await products.findOne({ productName: "Event" });
    if (!eventProduct) {
      return NextResponse.json(
        { message: "Event product not found" },
        { status: 404 }
      );
    }

    const allProspects = await prospects.find().toArray();

    // Collect prospect IDs that need to be updated, and compute their new expiry dates
    const updates = allProspects
      .filter((prospect) => {
        if (!prospect.date_expires || prospect.status !== "customer") return false;
        const dateExpires = new Date(prospect.date_expires);
        const expiresStr = dateExpires.toISOString().split("T")[0];
        return expiresStr <= todayStr;
      })
      .map((prospect) => {
        const isEventProduct =
          prospect.product_type_id?.toString() === eventProduct._id.toString();

        // Event products have a different expiry duration
        const timeToAdd = isEventProduct ? PROMOTER_EVENT_EXPIRE_TIME_DURATION : PROMOTER_PRODUCT_EXPIRE_TIME_DURATION;
        const newExpiry = new Date(now.getTime() + timeToAdd);

        return {
          _id: new ObjectId(prospect._id),
          newExpiry,
        };
      });

    if (updates.length === 0) {
      return NextResponse.json({
        message: "No matching prospects found for update.",
        matchedCount: 0,
        modifiedCount: 0,
      });
    }

    // Perform bulk update
    const bulkOps = updates.map(({ _id, newExpiry }) => ({
      updateOne: {
        filter: { _id },
        update: {
          $set: {
            status: "promoter",
            date_expires: newExpiry,
          },
        },
      },
    }));

    const result = await prospects.bulkWrite(bulkOps);

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
