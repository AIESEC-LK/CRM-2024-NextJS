// src/app/api/prospects/route.tsx

import { dbConnect } from "@/app/lib/db";
import Prospect from "@/app/models/Prospect";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();

    const prospectsFromDB = await Prospect.find(); // Retrieve all prospects from the database

    console.log("Fetched prospects:", prospectsFromDB);

    // Return prospects or empty array if none found
    if (prospectsFromDB.length === 0) {
      return NextResponse.json({ Prospects: [] });
    } else {
      return NextResponse.json({ Prospects: prospectsFromDB }); // Return fetched prospects
    }
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return NextResponse.json({ error: "Error fetching prospects" }, { status: 500 });
  }
}
