import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    const requests = await db.collection("Users").find({}).toArray();

    return NextResponse.json(requests);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { entity, companyName,companyAddress,contactPersonName,contactPersonNumber,contactPersonEmail,comment,industry,producttype,} = await req.json();
    const client = await clientPromise;
    const db = client.db("CRM");


    const result = await db.collection("Users").insertOne({
      entity: 'CS',
      companyName: companyName,
      companyAddress: companyAddress,
      contactPersonName: contactPersonName,
      contactPersonNumber: contactPersonNumber,
      contactPersonEmail: contactPersonEmail,
      comment: comment,
      industry: industry,
      producttype:producttype,
      status: "pending",

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
