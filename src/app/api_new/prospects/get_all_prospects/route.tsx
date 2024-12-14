import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const prospects = await db.collection("Prospects").aggregate([
      {
        $lookup: {
          from: "Entities",
          let: { entityId: "$entity_id" },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$entityId"] } } },
            { $project: { _id: 0, entityName: 1 } }
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
          company_id: 1,
          product_type_id: 1,
          entity_id: 1,
          date_added: 1,
          date_expires: 1,
          contactPersonName: 1,
          contactPersonNumber: 1,
          contactPersonEmail: 1,
          status: 1,
          company_name: { $arrayElemAt: ["$company.companyName", 0] },
          product_type_name: { $arrayElemAt: ["$product.productName", 0] },
          lc_name: { $arrayElemAt: ["$entity.entityName", 0] }
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
