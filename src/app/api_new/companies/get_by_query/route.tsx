import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

interface ICompanyQuery {
  _id: any;
  companyName: string;
}

interface ICompany {
  _id: any;
  companyName: string;
}

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("CRM24");

    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("companyName");
    // console.log("Received companyName query:", companyName);

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name query is required" },
        { status: 400 }
      );
    }
    // Use regular expression for case-insensitive, partial match search
    const company = await db.collection("Companies").find({
      companyName: { $regex: `^${companyName}`, $options: "i" },
    }).limit(10).toArray();

    const companyQueryResult: ICompanyQuery[] = company.map(({ _id, companyName }) => ({
      _id,
      companyName,
    }));

    /*
    for(var i=0;i<company.length;i++){
      var company_id = company[0]._id.toString();
      const partnership=await db.collection("Prospects").find({company_id:company_id}).toArray();
      
    }*/

    return NextResponse.json(companyQueryResult);

  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
