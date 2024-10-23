import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// POST method to clone a pending prospect to the prospects collection
export async function POST(req: Request) {
  const { id } = await req.json(); // Expecting the id of the pending prospect

  try {
    const client = await clientPromise;
    const db = client.db("CRM");

    // Find the pending prospect document by ID
    const pendingProspect = await db.collection("Pending_Prospects").findOne({ _id: new ObjectId(id) });

    // If the pending prospect does not exist, return an error
    if (!pendingProspect) {
      return NextResponse.json({ error: "Pending prospect not found" }, { status: 404 });
    }

    // Check if a prospect already exists for the same university entity
    const existingProspect = await db.collection("Prospects").findOne({ entity: pendingProspect.entity });

    // If no existing prospect is found, proceed with the transfer
    if (!existingProspect) {
      // Insert the pending prospect into the prospects collection
      await db.collection("Prospects").insertOne({ 
        ...pendingProspect, 
        status: "approved" // Set status to approved upon transfer
      });

      // Remove the prospect from the pending prospects collection
      await db.collection("Pending_Prospects").deleteOne({ _id: new ObjectId(id) });

      // Return a success response
      return NextResponse.json({ message: "Prospect cloned and transferred successfully" });
    } else {
      // If an existing prospect is found, return a conflict message
      return NextResponse.json({ message: "Prospect already exists for this entity" }, { status: 409 });
    }
  } catch (error) {
    console.error("Error cloning prospect:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
