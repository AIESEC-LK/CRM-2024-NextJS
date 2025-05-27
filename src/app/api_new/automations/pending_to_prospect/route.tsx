import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const pendingCollection = db.collection("Pending_Prospects");
    const prospectsCollection = db.collection("Prospects");
    const productsCollection = db.collection("Products");

    // Fetch product data to map product_type_id to "product" boolean
    const allProducts = await productsCollection.find({}).toArray();
    const productMap = new Map(
      allProducts.map((product) => [product._id.toString(), product.product])
    );

    // Fetch all pending prospects
    const pendingProspectsCursor = await pendingCollection.find({});
    const pendingProspects = await pendingProspectsCursor.toArray();

    for (const pending of pendingProspects) {
      const { company_id, product_type_id, entity_id, _id } = pending;

      // Fetch existing prospects with the same company_id
      const existingProspects = await prospectsCollection.find({ company_id }).toArray();

      let shouldProceed = true;

      for (const existing of existingProspects) {
        const sameProduct = existing.product_type_id === product_type_id;
        const pendingIsProduct = productMap.get(product_type_id.toString()) ?? false;
        const existingIsProduct = productMap.get(existing.product_type_id.toString()) ?? false;

        if (sameProduct) {
          // Case 1: Same product_id and company_id → do not proceed
          shouldProceed = false;
          break;
        }

        if (pendingIsProduct && existingIsProduct) {
          // Case 2.1: Both product → do not proceed
          shouldProceed = false;
          break;
        }

        if (!pendingIsProduct && !existingIsProduct) {
          // Case 2.2: Both non-product → do not proceed
          shouldProceed = false;
          break;
        }

        // Case 2.3 and 2.4 → proceed
      }

      if (!shouldProceed) {
        console.log(
          `Skipping pending prospect (ID: ${_id}) due to product/company rule conflict.`
        );
        continue;
      }

      // Step 3: Check if max prospect limit is reached for entity_id
      const countRes = await fetch(
        `${process.env. BASE_URL}/api_new/prospects/count_prospects?userLcId=${entity_id}`
      );
      const countData = await countRes.json();

      if (!countData.result) {
        console.log(
          `Skipping pending prospect (ID: ${_id}) due to max prospect limit exceeded.`
        );
        continue;
      }

      // Step 4: Move to Prospects collection
      await prospectsCollection.insertOne({
        ...pending,
        status: "promoter", // Update status
      });

      // Step 5: Delete from Pending_Prospects
      await pendingCollection.deleteOne({ _id: new ObjectId(_id) });

      console.log(`Moved pending prospect (ID: ${_id}) to Prospects.`);
    }

    return NextResponse.json({ message: "Processing completed successfully." });
  } catch (error) {
    console.error("Error in PATCH /api/move_pending_to_prospects:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
