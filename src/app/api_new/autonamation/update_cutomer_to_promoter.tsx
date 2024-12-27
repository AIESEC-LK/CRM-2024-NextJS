import cron from "node-cron";
import clientPromise from "@/app/lib/mongodb"; // Use clientPromise to connect to the database
import fetch from "node-fetch"; // Import fetch for API calls if not globally available
//import { BASE_URL } from "@/app/lib/values";

// Function to fetch the cron schedule dynamically from the database
async function getCronSchedule() {
  try {
    const response = await fetch(process.env.BASE_URL + "/api_new/autonamation/get_all_autonomations");
    if (!response.ok) {
      throw new Error(`Failed to fetch cron schedule: ${response.statusText}`);
    }
    const autonomations = await response.json() as { customer_to_promoter_transformation?: string }[];

    // Assuming the first document contains the needed transformation value
    return autonomations[0]?.customer_to_promoter_transformation || "0 0 * * *"; // Default to midnight daily if undefined
  } catch (error) {
    console.error("Error fetching cron schedule:", error);
    return "0 0 * * *"; // Default fallback schedule
  }
}

// Initialize and schedule the cron job dynamically
(async () => {
  const cronSchedule = await getCronSchedule(); // Fetch the schedule

  cron.schedule(cronSchedule, async () => {
    try {
      console.log("Running cron job to update customer status to promoter...");

      // Connect to the database
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME); // Access the correct database using DB_NAME from .env

      // Get today's date to check against expire_date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize the time to midnight to ensure accurate comparison

      // Find records where status is "customer" and expire_date <= today
      const updateResult = await db.collection("Prospects").updateMany(
        {
          status: "customer",
          date_expires: { $lte: today } // Compare against today
        },
        {
          $set: { status: "promoter" }
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(`${updateResult.modifiedCount} prospects updated to promoter.`);
      } else {
        console.log("No prospects were updated.");
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });

  console.log(`Cron job for updating customer status to promoter is scheduled with schedule: ${cronSchedule}`);
})();
