import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity_id = searchParams.get("entity_id")?.toString();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const prospects = await db.collection("Prospects").aggregate([
      {
        $match: {
          entity_id: entity_id // Filter the documents by entity_id
        }
      },
      {
        $lookup: {
          from: "Entities",
          let: { entityId: "$entity_id" },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$entityId"] } } },
            { $project: { _id: 0, entityName: 1, color: 1 } }
          ],
          as: "entity"
        }
      },
      {
        $lookup: {
          from: "Companies",
          let: { companyId: "$company_id" },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$companyId"] } } },
            { $project: { _id: 0, companyName: 1 } }
          ],
          as: "company"
        }
      },
      {
        $lookup: {
          from: "Products",
          let: { productTypeId: "$product_type_id" },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$productTypeId"] } } },
            { $project: { _id: 0, productName: 1 } }
          ],
          as: "product"
        }
      },
      {
        $project: {
          _id: 1,
          date_added: 1,
          date_expires: 1,
          status: 1,
          company_name: { $arrayElemAt: ["$company.companyName", 0] },
          product_type_name: { $arrayElemAt: ["$product.productName", 0] },
          activities: 1, // Include activities field
          lead_proof_url: 1 // Include lead_proof_url field
        }
      },
      {
        $unionWith: {
          coll: "Pending_Prospects",
          pipeline: [
            {
              $match: {
                entity_id: entity_id // Match the same entity_id in Pending_Prospects
              }
            },
            {
              $lookup: {
                from: "Entities",
                let: { entityId: "$entity_id" },
                pipeline: [
                  { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$entityId"] } } },
                  { $project: { _id: 0, entityName: 1, color: 1 } }
                ],
                as: "entity"
              }
            },
            {
              $lookup: {
                from: "Companies",
                let: { companyId: "$company_id" },
                pipeline: [
                  { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$companyId"] } } },
                  { $project: { _id: 0, companyName: 1 } }
                ],
                as: "company"
              }
            },
            {
              $lookup: {
                from: "Products",
                let: { productTypeId: "$product_type_id" },
                pipeline: [
                  { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$productTypeId"] } } },
                  { $project: { _id: 0, productName: 1 } }
                ],
                as: "product"
              }
            },
            {
              $project: {
                _id: 1,
                date_added: 1,
                date_expires: 1,
                status: 1,
                company_name: { $arrayElemAt: ["$company.companyName", 0] },
                product_type_name: { $arrayElemAt: ["$product.productName", 0] },
                activities: 1, // Include activities field
                lead_proof_url: 1 // Include lead_proof_url field
              }
            }
          ]
        }
      }
    ]).toArray();


    return NextResponse.json(prospects);
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
