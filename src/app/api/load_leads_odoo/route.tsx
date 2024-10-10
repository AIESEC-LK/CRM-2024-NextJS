import { odooRetrieve } from "@/app/lib/odooRetrive";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await odooRetrieve();
    
    // Ensure the result is an array and map over each company to add the required fields
    const updatedData = data.result.map((company: any) => ({
      ...company,
      product_lc: null,
      product: null,
      project_lc: null,
      project: null,
      status: "pending"
    }));

    // Return the modified data with additional fields
    return NextResponse.json({
      ...data,
      result: updatedData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


