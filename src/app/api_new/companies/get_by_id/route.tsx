import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
export const dynamic = "force-dynamic";

export interface ICompanyData {
  companyId: string;
  companyName: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  comment: string;
  industryId: string;
}


export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("CRM24");

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("company_id");
    // console.log("Received companyName query:", companyName);
    if (!companyId) {
      return NextResponse.json(
        { error: "Company name query is required" },
        { status: 400 }
      );
    }
    // Use regular expression for case-insensitive, partial match search
    const company = await db.collection("Companies").findOne({ _id: new ObjectId(companyId) })
    if (company) {
      const companyData: ICompanyData = {
        companyId: company._id.toString(), // Map _id from fetched data to company_id
        companyName: company.companyName || '',
        companyAddress: company.companyAddress || '',
        contactPersonName: company.contactPersonName || '',
        contactPersonNumber: company.contactPersonNumber || '',
        contactPersonEmail: company.contactPersonEmail || '',
        comment: company.comment || '',
        industryId: company.industry_id || ''
      };

      return NextResponse.json(companyData);
    }


    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );

  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
