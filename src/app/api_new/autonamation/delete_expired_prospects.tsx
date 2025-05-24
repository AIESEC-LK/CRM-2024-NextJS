import cron from "node-cron";
import clientPromise from "@/app/lib/mongodb"; // Use clientPromise to connect to the database
//import { BASE_URL } from "@/app/lib/values";

// Function to fetch the cron schedule dynamically from the database
async function getCronScheduleForDeletingExpiredProspects() {
  try {
    const response = await fetch(process.env.BASE_URL + "/api_new/autonamation/get_all_autonomations");
    if (!response.ok) {
      throw new Error(`Failed to fetch cron schedule: ${response.statusText}`);
    }
    const autonomations = await response.json();

    // Assuming the first document contains the needed transformation value for deletion
    return autonomations[0]?.prospect_deletion || "* 1 0 * *"; // Default to midnight daily if undefined
  } catch (error) {
    console.error("Error fetching cron schedule for deleting expired prospects:", error);
    return "* 1 0 * *"; // Default fallback schedule
  }
}

// Initialize and schedule the cron job dynamically
(async () => {
  const cronSchedule = await getCronScheduleForDeletingExpiredProspects(); // Fetch the schedule

  cron.schedule(cronSchedule, async () => {
    try {
      console.log("Running cron job to detlete PEnding Prospects...");

      // Connect to the database
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME); // Access the correct database using DB_NAME from .env

      // Get today's date to check against expire_date
      const today = new Date();
      today.setHours(0 ,0, 0, 0); // Normalize the time to midnight to ensure accurate comparison
 // Find all expired prospects or leads
      const expiredProspects = await db.collection("Pending_Prospects").find(
        {
          date_expires: { $lte: today }, // Compare against today
        }
      ).toArray();

      if (expiredProspects.length > 0) {
        console.log(`Found ${expiredProspects.length} expired pending prospects. Moving to deleted_prospects...`);

        // Insert expired prospects or leads into deleted_prospects collection
        await db.collection("deleted_prospects").insertMany(expiredProspects);

        // Delete expired prospects or leads from Prospects collection
        const deleteResult = await db.collection("Prospects").deleteMany({
          status: { $in: ["prospect", "lead"] }, // Match the same condition
          date_expires: { $lte: today },
        });

        console.log(`Successfully moved and deleted ${deleteResult.deletedCount} expired pending prospects.`);
      } else {
        console.log("No expired pending prospects or found.");
      }
    } catch (error) {
      console.error("Error in cron job for deleting expired pending prospects:", error);
    }
  });

  console.log(`Cron job for deleting expired pending prospects is scheduled with schedule: ${cronSchedule}`);
})();
