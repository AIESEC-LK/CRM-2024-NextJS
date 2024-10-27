import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("CRM");
    
    const collections = await db.listCollections().toArray();
    console.log("Available Collections:", collections);

    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("companyName");
    console.log("Received companyName query:", companyName);

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name query is required" },
        { status: 400 }
      );
    }
    // Use regular expression for case-insensitive, partial match search
    const requests = await db.collection("Prospects").find({
        companyName: { $regex: `^${companyName}`, $options: "i" },
      }).limit(10).toArray();
      console.log("Fetched requests:", requests);
      
    return NextResponse.json(requests);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
