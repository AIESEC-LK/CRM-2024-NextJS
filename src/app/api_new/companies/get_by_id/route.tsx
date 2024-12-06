import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

interface ICompanyQuery {
  _id: any;
  companyName: string;
}

interface ICompany {
  _id: any;
  companyName: string;
}

interface ICompanyDetails {
    _id: any;
    companyName: string;
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
    const company = await db.collection("Companies").findOne({_id:new ObjectId(companyId)})

    return NextResponse.json(company);

  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
