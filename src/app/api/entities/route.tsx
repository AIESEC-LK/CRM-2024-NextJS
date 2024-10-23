import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    const entities = await db.collection("Entities").find({}).toArray();
    return NextResponse.json(entities);
  } catch (e) {
    console.error("Error fetching entities:", e);
    return NextResponse.json(
      { error: "Failed to fetch entities" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const client = await clientPromise;
    const db = client.db("CRM");
    const result = await db.collection("Entities").insertOne({ name });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    console.error("Error adding entity:", e);
    return NextResponse.json(
      { error: "Failed to add entity" },
      { status: 500 }
    );
  }
}
