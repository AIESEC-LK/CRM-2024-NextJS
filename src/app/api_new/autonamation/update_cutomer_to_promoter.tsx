import cron from "node-cron";
import clientPromise from "@/app/lib/mongodb"; // Use clientPromise to connect to the database

// The cron job to run based on the .env schedule or a default value
const cronSchedule = process.env.CRON_SCHEDULE || '0 0 * * *';

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

console.log("Cron job for updating customer status to promoter is scheduled.");
