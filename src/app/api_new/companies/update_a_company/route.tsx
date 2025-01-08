import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    // Read the body once and store it
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const updateFields: any = {};
    
    // Use the stored body object instead of reading req.json() again
    if (body.companyName !== undefined) updateFields.companyName = body.companyName;
    if (body.companyAddress !== undefined) updateFields.companyAddress = body.companyAddress;
    if (body.contactPersonName !== undefined) updateFields.contactPersonName = body.contactPersonName;
    if (body.contactPersonNumber !== undefined) updateFields.contactPersonNumber = body.contactPersonNumber;
    if (body.contactPersonEmail !== undefined) updateFields.contactPersonEmail = body.contactPersonEmail;
    if (body.comment !== undefined) updateFields.comment = body.comment;
    if (body.industry_id !== undefined) updateFields.industry_id = body.industry_id;
    if (body.approved !== undefined) updateFields.approved = body.approved;

    try {
      const result = await db.collection("Companies").updateOne(
        { _id: new ObjectId(body.id) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
      }

      if (result.modifiedCount > 0) {
        return NextResponse.json({ success: true, message: "Company updated successfully" });
      }

      return NextResponse.json({ success: false, message: "No changes made" });
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
      }
      throw error;
    }

  } catch (e) {
    console.error("Error updating company:", e);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}