import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

interface ICompanyQuery {
  _id: string;
  companyName: string;
  dateexpiresEvent: Date | null;
  dateexpiresProduct: Date | null;
}

async function getCompanyLastProspect(companyId: string, productId: string): Promise<Date | null> {
  const client = await clientPromise;
  const db = client.db("CRM24");

  const lastProspectCursor = await db.collection("Prospects")
    .find({ company_id: companyId, product_type_id: productId })
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  return lastProspectCursor[0]?.date_expires || null;
}

export async function GET(req: Request) {
  const eventID = "6734053c308fd8d176381e07";
  const productId = "6734054e308fd8d176381e08";

  try {
    const client = await clientPromise;
    const db = client.db("CRM24");

    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("companyName");

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name query is required" },
        { status: 400 }
      );
    }

    const company = await db.collection("Companies").find({
      companyName: { $regex: `^${companyName}`, $options: "i" },
    }).limit(10).toArray();

    const companyQueryResult: ICompanyQuery[] = await Promise.all(
      company.map(async ({ _id, companyName }) => {
        const dateexpiresEvent = await getCompanyLastProspect(_id.toString(), eventID);
        const dateexpiresProduct = await getCompanyLastProspect(_id.toString(), productId);

        return {
          _id: _id.toString(), // Convert ObjectId to string
          companyName,
          dateexpiresEvent,
          dateexpiresProduct,
        };
      })
    );

    return NextResponse.json(companyQueryResult);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
