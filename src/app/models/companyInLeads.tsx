import mongoose, { Schema, Document } from "mongoose";

interface ICompanyInLeads extends Document {
    ID: number;
    Name: string;
    Email: string;
    Phone: string;
    Street: string;
    Status: string;
}

const CompanyInLeadsSchema: Schema = new Schema({
    ID: { type: Number, required: true },
    Name: { type: String, required: false },
    Email: { type: String, required: false },
    Phone: { type: String, required: false },
    Street: { type: String, required: false },
    Status: { type: String, required: false }
});

export default mongoose.models.CompanyInLeads || mongoose.model<ICompanyInLeads>("CompanyInLeads", CompanyInLeadsSchema);