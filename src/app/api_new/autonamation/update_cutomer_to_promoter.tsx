import cron from "node-cron";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// Retrieve cron schedule from environment variable
const cronSchedule = process.env.CRON_SCHEDULE || '0 0 * * *'; // Default to midnight if not set

// The cron job with dynamic schedule
cron.schedule(cronSchedule, async () => {
  try {
    console.log("Running cron job to update customer status to promoter...");

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Get today's date to check against expire_date
    const today = new Date();

    // Find records where status is "customer" and expire_date >= today
    const updateResult = await db.collection("Prospects").updateMany(
      {
        status: "customer",
        date_expires: { $lte: today }
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

console.log(`Cron job for updating customer status to promoter is scheduled with cron expression: ${cronSchedule}`);

