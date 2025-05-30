import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {

      const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }


    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const prospect = await db
      .collection("Prospects")
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: "Entities",
            let: { entityId: "$entity_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$entityId"] },
                },
              },
              { $project: { _id: 0, entityName: 1, color: 1 } },
            ],
            as: "entity",
          },
        },
        {
          $lookup: {
            from: "Companies",
            let: { companyId: "$company_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$companyId"] },
                },
              },
              { $project: { _id: 0, companyName: 1 } },
            ],
            as: "company",
          },
        },
        {
          $lookup: {
            from: "Products",
            let: { productTypeId: "$product_type_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$productTypeId"] },
                },
              },
              { $project: { _id: 0, productName: 1 } },
            ],
            as: "product",
          },
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
            lc_name: { $arrayElemAt: ["$entity.entityName", 0] },
            lc_color: { $arrayElemAt: ["$entity.color", 0] },
            activities: 1,
            lead_proof_url: 1,
          },
        },
      ])
      .toArray();

    if (prospect.length === 0) {
      return NextResponse.json(
        { error: "Prospect not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prospect[0]);
  } catch (e) {
    console.error("Error fetching prospect:", e);

    return NextResponse.json(
      { error: "Failed to fetch prospect details" },
      { status: 500 }
    );
  }
}
