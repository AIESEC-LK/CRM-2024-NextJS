import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
//import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Fetch all pending prospects
    const pendingProspects = await db
      .collection("Pending_Prospects")
      .find({ status: "pending" })
      .toArray();

    // Fetch all companies
    const companies = await db.collection("Companies").find({}).toArray();

    // Fetch all entities
    const entities = await db.collection("Entities").find({}).toArray();

    // Fetch all products
    const products = await db.collection("Products").find({}).toArray();

    // Create maps for lookup
    const companyMap = companies.reduce((map, company) => {
      map[company._id.toString()] = {
        companyName: company.companyName,
        companyAddress: company.companyAddress,
      };
      return map;
    }, {} as Record<string, { companyName: string; companyAddress: string }>);

    const entityMap = entities.reduce((map, entity) => {
      map[entity._id.toString()] = {
        entityName: entity.entityName,
        color: entity.color,
      };
      return map;
    }, {} as Record<string, { entityName: string; color: string }>);

    const productMap = products.reduce((map, product) => {
      map[product._id.toString()] = {
        productName: product.productName,
      };
      return map;
    }, {} as Record<string, { productName: string }>);

    // Enrich pending prospects
    const enrichedProspects = pendingProspects.map((prospect) => {
      const companyDetails = companyMap[prospect.company_id.toString()] || {
        companyName: "Unknown",
        companyAddress: "Unknown",
      };

      const entityDetails = entityMap[prospect.entity_id.toString()] || {
        entityName: "Unknown",
      };

      const productDetails = productMap[prospect.product_type_id.toString()] || {
        productName: "Unknown",
      };

      // Calculate date_expires
      const dateAdded = new Date(prospect.date_added);
      const dateExpires = new Date(dateAdded);
      dateExpires.setDate(dateAdded.getDate() + 30);

      return {
        _id: prospect._id,
        company_id: prospect.company_id,
        product_type_id: prospect.product_type_id,
        entity_id: prospect.entity_id,
        date_added: prospect.date_added,
        date_expires: dateExpires.toISOString(),
        contactPersonName: prospect.contactPersonName,
        contactPersonNumber: prospect.contactPersonNumber,
        contactPersonEmail: prospect.contactPersonEmail,
        status: prospect.status,
        companyName: companyDetails.companyName,
        companyAddress: companyDetails.companyAddress,
        productName: productDetails.productName,
        entityName: entityDetails.entityName,
        entityColor: entityDetails.color,
      };
    });

    return NextResponse.json(enrichedProspects, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending prospects:", error);
    return NextResponse.json({ error: "Failed to fetch pending prospects" }, { status: 500 });
  }
}
