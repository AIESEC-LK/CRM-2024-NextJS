import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {productName, abbravation,product} = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);


    const result = await db.collection("Products").insertOne({
      productName: productName,
      abbravation: abbravation,
      product:product


    });

    if (result.insertedId) {
      return NextResponse.json({ success: true, id: result.insertedId });
    }


    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error updating request:", e);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}