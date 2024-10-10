import mongoose, { Schema, Document } from "mongoose";

interface ICompany extends Document {
    ID: number;
    Name: string;
    Email: string;
    Phone: string;
    Street: string;
    Street2: string;
    Zip: string;
    product_lc: string;
    product: string;
    event_lc: string;
    event: boolean;
}

const CompanySchema: Schema = new Schema({
    ID: { type: Number, required: false },
    Name: { type: String, required: false },
    Email: { type: String, required: false },
    Phone: { type: String, required: false },
    Street: { type: String, required: false },
    Street2: { type: String, required: false },
    Zip: { type: String, required: false },
    product_lc: { type: String, required: false },
    product: { type: String, required: false },
    event_lc: { type: String, required: false },
    event: { type: Boolean, required: false },
});

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
