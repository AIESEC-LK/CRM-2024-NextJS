import clientPromise from "@/app/lib/mongodb";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface IProspectRequest {
  company_id: String;
  companyName: String;
  companyAddress: String;
  contactPersonName: String;
  contactPersonNumber: String;
  contactPersonEmail: String;
  producttype: String;
  comment: String;
  industry_id: String;
}


export async function POST(req: Request) {
  try {
    const prospect: IProspectRequest = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    var createCompany = false;

    // Set current date as the date added
    const dateAdded = new Date();

    const entity_id = "586";//Fetch from Auth

    // Set date expires to three months from now
    const dateExpires = new Date();
    dateExpires.setMonth(dateExpires.getMonth() + 3);

    //Check whether the company already exists
    if (prospect.company_id == "" || prospect.company_id == null) {
      createCompany = true;
    } else {
      const company = await db.collection("Companies").findOne({ _id: prospect.company_id });
      if (!company) {
        createCompany = true;
      }
    }

    if (createCompany) {
      const result = await db.collection("Companies").insertOne({
        companyName: prospect.companyName,
        companyAddress: prospect.companyAddress,
        contactPersonName: prospect.contactPersonName,
        contactPersonNumber: prospect.contactPersonNumber,
        contactPersonEmail: prospect.contactPersonEmail,
        industry_id: prospect.industry_id,
        comment: prospect.comment,
        approved: false
      });
      prospect.company_id = result.insertedId.toString();
    }

    const result = await db.collection("Prospects").insertOne({
      company_id: prospect.company_id,
      product_type_id: prospect.producttype,
      entity_id: entity_id,
      date_added: dateAdded,
      date_expires: dateExpires,
      contactPersonName: prospect.contactPersonName,
      contactPersonNumber: prospect.contactPersonNumber,
      contactPersonEmail: prospect.contactPersonEmail,
      status: PROSPECT_VALUES[0].value
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error("Error updating request:", e);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}



