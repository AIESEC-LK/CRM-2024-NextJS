import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, color } = await req.json();

    if (!name || !color) {
      return NextResponse.json(
        { error: "Name and color are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CRM");

    const result = await db.collection("Entities").insertOne({
      name,
      color,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          name,
          color,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error adding entity:", e);
    return NextResponse.json(
      { error: "Failed to add entity" },
      { status: 500 }
    );
  }
}

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
