export interface IRequest {
    _id: string;
    entity: string;
    companyName: string;
    companyAddress?: string;
    contactPersonName: string;
    contactPersonNumber?: string;
    contactPersonEmail?: string;
    industry: string;
    producttype: string;
    comment?: string;
    status: "pending" | "approved" | "declined";
    partnership: string;
    dateAdded?: Date; 
    expireDate?: Date;
  }
