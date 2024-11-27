import clientPromise from "@/app/lib/mongodb";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { NextResponse } from "next/server";

interface IProspectRequest{
  _id: string;
  companyName: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  producttype: string;
  industry_id	:string;
  comment:string;
}


export async function POST(req: Request) {
  try {
    const prospect:IProspectRequest = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Set current date as the date added
    const dateAdded = new Date();

    const entity_id="586";//Fetch from Auth

    // Set date expires to three months from now
    const dateExpires = new Date();
    dateExpires.setMonth(dateExpires.getMonth() + 3);

    const result = await db.collection("Prospects").insertOne({
      company_id: prospect._id,
      product_type_id: prospect.producttype,
      entity_id: entity_id,
      date_added: dateAdded,
      date_expires: dateExpires,
      contactPersonName: prospect.contactPersonName,
      contactPersonNumber: prospect.contactPersonNumber,
      contactPersonEmail: prospect.contactPersonEmail,
      status: PROSPECT_VALUES[0].value 
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
