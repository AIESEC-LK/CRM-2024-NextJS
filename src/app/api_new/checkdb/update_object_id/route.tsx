import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, newObjectId, collectionName } = await req.json();

    if (!collectionName) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);

    // Find the document to copy data
    const existingDoc = await collection.findOne({ _id: new ObjectId(id) });

    if (!existingDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Remove the `_id` field from the copied document
    delete (existingDoc as { _id?: any })._id;

    // Insert a new document with the updated `_id`
    const newDoc = await collection.insertOne({
      ...existingDoc,
      _id: new ObjectId(newObjectId),
    });

    if (!newDoc.insertedId) {
      return NextResponse.json({ error: "Failed to create new document" }, { status: 500 });
    }

    // Delete the old document
    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, newId: newObjectId });
  } catch (e) {
    console.error("Error updating document:", e);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}