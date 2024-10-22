// src/app/models/Prospect.js
import mongoose from "mongoose";

const prospectSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  entity: { type: String, required: true },
  productType: { type: String, required: false },
  approvalStatus: { type: String, required: true, enum: ["Approved", "Pending", "Rejected"] },
});


const Prospect = mongoose.models.Prospect || mongoose.model("Prospect", prospectSchema);
export default Prospect;
