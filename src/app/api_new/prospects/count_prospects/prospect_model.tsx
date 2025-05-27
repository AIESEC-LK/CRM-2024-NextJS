import mongoose, { Schema, Document } from 'mongoose';

// Define the Prospect interface
export interface IProspect extends Document {
  companyId: string;
  companyName: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  productId: string;
  comment: string;
  industryId: string;
  userLcId: string;
  producttype?: string;
  status: string;
}

// Define the Mongoose schema
const ProspectSchema = new Schema<IProspect>({
  companyId: { type: String, required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  contactPersonNumber: { type: String, required: true },
  contactPersonEmail: { type: String, required: true },
  productId: { type: String, required: true },
  comment: { type: String, required: true },
  industryId: { type: String, required: true },
  userLcId: { type: String, required: true },
  producttype: { type: String },
  status: { type: String, required: true },
});

// Export the model
const Prospect = mongoose.models.Prospect || mongoose.model<IProspect>('Prospect', ProspectSchema);

export default Prospect;