// api/add_company_to_bulk_list/route.ts
import { dbConnect } from "@/app/lib/db";
import Company from "@/app/models/company";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the request body
    console.log("Received body:", body);

    await dbConnect(); // Ensure DB is connected

    // Check if company with the same ID already exists
    /*
    const existingCompany = await Company.findOne({ ID: body.ID });
    if (existingCompany) {
      console.error(`Company with ID ${body.ID} already exists`);
      return NextResponse.json({ success: false, message: `Company with ID ${body.ID} already exists` }, { status: 400 });
    }*/

    // Attempt to insert the company into the database
    const newCompany = await Company.create(body);
    console.log("Company successfully inserted:", newCompany);

    return NextResponse.json({ success: true, data: newCompany }, { status: 201 });
  } catch (error) {
    console.error("Error inserting company:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
