// src/app/models/Prospect.js
import mongoose from "mongoose";

const prospectSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  entity: { type: String, required: true },
  productType: { type: String, required: false },
  industry: { type: String, required: false }, // Add this field
  label: { type: String, required: true, enum: ["Prospect", "Promoter","Customer", "EntityPartner","Lead"] }, // Add this field
  partnership: { type: String, required: false },
  approvalStatus: { type: String, required: true, enum: ["Approved", "Pending", "Rejected"] },
}, { timestamps: true });

const Prospect = mongoose.models.Prospect || mongoose.model("Prospect", prospectSchema);
export default Prospect;
