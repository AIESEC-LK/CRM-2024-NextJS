// models/Request.js
import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  entity: { type: String, required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  producttype: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
});

const Request =
  mongoose.models.Request || mongoose.model("Request", RequestSchema);

export default Request;
