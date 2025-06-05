import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const entityObjectId = new ObjectId(id);
    const collectionsToCheck = [
      "Prospects",
      "Pending_Prospects",
      "Deleted_Prospects",
      "Users"
    ];

    for (const collection of collectionsToCheck) {
      const reference = await db.collection(collection).findOne(
        collection === "Users" ? { userEntityId: entityObjectId } : { entity_id: entityObjectId }
      );
      if (reference) {
        return NextResponse.json({
          error: `Entity is referenced in ${collection}, cannot delete.`,
          status: 402,
        });
      }
    }

    // Proceed with deletion
    const result = await db.collection("Entities").deleteOne({ _id: entityObjectId });

    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records deleted" });
  } catch (e) {
    console.error("Error deleting entity:", e);
    return NextResponse.json({ error: "Failed to delete entity" }, { status: 500 });
  }
}