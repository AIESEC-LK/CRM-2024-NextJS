// utils/cron/updateProspects.ts

import mongoose from 'mongoose';
import cron from 'node-cron';

const CONNECTION_STRING = process.env.CONNECTION_STRING!;
const DB_NAME = process.env.DB_NAME!;

const prospectSchema = new mongoose.Schema({
  status: String,
  dateExpires: Date,
}, { collection: 'Prospects' });

const Prospect = mongoose.models.Prospect || mongoose.model('Prospect', prospectSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(CONNECTION_STRING, {
      dbName: DB_NAME,
    });
  }
}

export function startCustomerToPromoterCron() {
  cron.schedule('0 * * * *', async () => {
    try {
      await connectDB();

      const today = new Date();
      const result = await Prospect.updateMany(
        {
          status: 'customer',
          dateExpires: { $lte: today },
        },
        { $set: { status: 'promoter' } }
      );

      console.log(`[CRON] Updated ${result.modifiedCount} prospects at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('[CRON ERROR]', error);
    }
  });
}
