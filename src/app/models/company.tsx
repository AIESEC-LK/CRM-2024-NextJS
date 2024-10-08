import mongoose, { Schema, Document } from "mongoose";

interface ICompany extends Document {
    ID: number;
    Name: string;
    Email: string;
    Phone: string;
    Street: string;
    Street2: string;
    Zip: string;
}

const CompanySchema: Schema = new Schema({
    ID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Phone: { type: String, required: true },
    Street: { type: String, required: true },
    Street2: { type: String, required: true },
    Zip: { type: String, required: true },
});

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
