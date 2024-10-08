import { NextResponse } from "next/server";
import Company from "@/app/models/company";
import { dbConnect } from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        // Step 1: Connect to the database
        await dbConnect();

        // Step 2: Parse the incoming request body
        const data = await req.json();

        // Step 3: Create and insert a new company document
        const newCompany = new Company(data);
        await newCompany.save();

        return NextResponse.json({ message: "Company created successfully", company: newCompany });
    } catch (error) {
        console.error(error);
        return new NextResponse("Failed to insert document", { status: 500 });
    }
}
