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

async function getCompanyLastProspect(companyId: string,productId:String) {
  const client = await clientPromise;
  const db = client.db("CRM24");

  const lastProspectCursor = await db.collection("Prospects")
  .find({ company_id: companyId.toString(), product_type_id: productId.toString() })
  .sort({ _id: -1 })
  .limit(1)
  .toArray();
  
  return lastProspectCursor[0]?.date_expires;
}

export async function GET(req: Request) {
  const eventID="6734053c308fd8d176381e07";
  const productId="6734054e308fd8d176381e08";
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
    

    const companyQueryResult: ICompanyQuery[] = await Promise.all(
      company.map(async ({ _id, companyName }) => {
        // Get the additional fields by calling the function
        const dateexpiresEvent = await getCompanyLastProspect(_id.toString(), eventID);
        const dateexpiresProduct = await getCompanyLastProspect(_id.toString(), productId);
    
        // Return the updated object with the new fields
        return {
          _id,
          companyName,
          dateexpiresEvent,
          dateexpiresProduct,
        };
      })
    );

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
