import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { id, companyName, companyAddress, contactPersonName, contactPersonNumber, contactPersonEmail, comment, industry_id ,approved} = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const updateFields: any = {};
    if (companyName !== null) updateFields.companyName = companyName;
    if (companyAddress !== null) updateFields.companyAddress = companyAddress;
    if (contactPersonName !== null) updateFields.contactPersonName = contactPersonName;
    if (contactPersonNumber !== null) updateFields.contactPersonNumber = contactPersonNumber;
    if (contactPersonEmail !== null) updateFields.contactPersonEmail = contactPersonEmail;
    if (comment !== null) updateFields.comment = comment;
    if (industry_id !== null) updateFields.industry_id = industry_id;
     updateFields.approved = true;

    const result = await db.collection("Companies").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records updated" });
  } catch (e) {
    console.error("Error updating company:", e);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}
