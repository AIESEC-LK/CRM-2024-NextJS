import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
//import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Aggregation pipeline to fetch related data
    const requests = await db.collection("Pending_Prospects").aggregate([
      {
        $addFields: {
          companyObjectId: { $toObjectId: "$company_id" },
          productObjectId: { $toObjectId: "$product_type_id" },
          entityObjectId: { $toObjectId: "$entity_id" },
        },
      },
      {
        $lookup: {
          from: "Companies",
          localField: "companyObjectId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "Products",
          localField: "productObjectId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "Entities",
          localField: "entityObjectId",
          foreignField: "_id",
          as: "entity",
        },
      },
      {
        $unwind: "$company", // Unwind company object
      },
      {
        $unwind: "$product", // Unwind product object
      },
      {
        $unwind: "$entity", // Unwind entity object
      },
      {
        $project: {
          _id: 1,
          company_id: 1,
          product_type_id: 1,
          entity_id: 1,
          date_added: 1,
          contactPersonName: 1,
          contactPersonNumber: 1,
          contactPersonEmail: 1,
          status: 1,
          companyName: "$company.companyName", // Add companyName
          companyAddress: "$company.companyAddress", // Add companyAddress
          productName: "$product.productName", // Add productName
          entityName: "$entity.entityName",   // Add entityName
        },
      },
    ]).toArray();

    return NextResponse.json(requests);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
