import cron from "node-cron";
import clientPromise from "@/app/lib/mongodb"; // Use clientPromise to connect to the database
import fetch from "node-fetch"; // Import fetch for API calls if not globally available
///import { BASE_URL } from "@/app/lib/values";

// Define the type for the autonomations response
type AutonomationsResponse = {
  pending_to_prospect_conversion?: string;
}[];

// Function to fetch the cron schedule dynamically from the database
async function getCronSchedule() {
  try {
    const response = await fetch(process.env.BASE_URL +`/api_new/autonamation/get_all_autonomations`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cron schedule: ${response.statusText}`);
    }
    const autonomations: AutonomationsResponse = await response.json() as AutonomationsResponse;

    // Get the pending_to_prospect_conversion schedule from the first document
    return autonomations[0]?.pending_to_prospect_conversion || "13 57 * * *"; // Default to midnight daily if undefined
  } catch (error) {
    console.error("Error fetching cron schedule:", error);
    return "13 57 * * *"; // Default fallback schedule
  }
}

// Initialize and schedule the cron job dynamically
(async () => {
  const cronSchedule = await getCronSchedule(); // Fetch the schedule dynamically

  cron.schedule(cronSchedule, async () => {
    try {
      console.log("Running cron job to transfer Pending_Prospects to Prospects...");

      // Connect to the database
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME); // Access the correct database using DB_NAME from .env

      // Fetch products and categorize them dynamically
      const products = await db.collection("Products").find({}).toArray();
      const part1 = products
        .filter((product) => product.abbravation === "event")
        .map((product) => product._id.toString());
      const part2 = products
        .filter((product) => product.abbravation !== "event")
        .map((product) => product._id.toString());

      // Fetch all prospects and pending prospects
      const pendingProspects = await db.collection("Pending_Prospects").find().toArray();
      const prospects = await db.collection("Prospects").find().toArray();

      for (const pendingProspect of pendingProspects) {
        const { company_id, product_type_id } = pendingProspect;

        // Skip if company_id already exists in Prospects for the same product
        const matchingProspect = prospects.find(
          (prospect) =>
            prospect.company_id === company_id &&
            prospect.product_type_id === product_type_id
        );

        // Check Part 1 and Part 2 conditions
        const part1Match = part1.includes(product_type_id) &&
          prospects.some(p => p.company_id === company_id && part1.includes(p.product_type_id));
        const part2Match = part2.includes(product_type_id) &&
          prospects.some(p => p.company_id === company_id && part2.includes(p.product_type_id));

        if (!matchingProspect && !part1Match && !part2Match) {
          // Transfer the oldest pending prospect to Prospects
          await db.collection("Prospects").insertOne(pendingProspect);
          await db.collection("Pending_Prospects").deleteOne({ _id: pendingProspect._id });

          console.log(`Transferred pending prospect with ID ${pendingProspect._id} to Prospects.`);
        }
      }
    } catch (error) {
      console.error("Error in cron job for transferring Pending_Prospects:", error);
    }
  });

  console.log(`Cron job for transferring Pending_Prospects to Prospects scheduled with schedule: ${cronSchedule}`);
})();
