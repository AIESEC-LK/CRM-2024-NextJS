// models/Request.js
import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  entity: { type: String, required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String},
  contactPersonName: { type: String, required: true },
  contactPersonNumber: { type: String},
  contactPersonEmail: { type: String},
  industry: { type: String, required: true },
  producttype: { type: String, required: true },
  comment: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
});

const Request = mongoose.models.Request || mongoose.model("Request", RequestSchema);

  export { Request };
