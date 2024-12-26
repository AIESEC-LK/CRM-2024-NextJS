import clientPromise from "@/app/lib/mongodb";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface IProspectRequest {
  companyId: string;
  companyName: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonEmail: string;
  productId: string;
  comment: string;
  industryId: string;
}


export async function POST(req: Request) {
  try {
    let company = null;
    let newCompany = false;
    
    const prospect: IProspectRequest = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    let createCompany = false;

    //Map all other Product ID to the SameProduct ID except Event(6734053c308fd8d176381e07)
    if (prospect.productId != "6734053c308fd8d176381e07") {
      prospect.productId = "6734054e308fd8d176381e08";
    }

    // Set current date as the date added
    const dateAdded = new Date();

    /* TODO*/
    //Fetch from Auth
    const entity_id = "675dbabf296393f677c5cf21";

    // Set date expires to three months from now
    const dateExpires = new Date();
    dateExpires.setMonth(dateExpires.getMonth() + 3);

    //Check whether the company already exists
    if (prospect.companyId == "" || prospect.companyId == null) {
      //Create a new company bcz company id is null
      createCompany = true;
    } else {
      company = await db.collection("Companies").findOne({ _id: new ObjectId(prospect.companyId.toString()) });
      if (!company) {
        createCompany = true;
      }
    }

    if (createCompany) {
      const createCompanyResult = await db.collection("Companies").insertOne({
        companyName: prospect.companyName,
        companyAddress: prospect.companyAddress,
        contactPersonName: prospect.contactPersonName,
        contactPersonNumber: prospect.contactPersonNumber,
        contactPersonEmail: prospect.contactPersonEmail,
        industry_id: prospect.industryId,
        comment: prospect.comment,
        approved: false
      });
      /*TODO
      //Integrate with Raveens`s API for Company Approvel currently prospect will places
      **
      **
      **
      */
      prospect.companyId = createCompanyResult.insertedId.toString();
      newCompany = true;
      company = await db.collection("Companies").findOne({ _id: new ObjectId(prospect.companyId.toString()) });
    }

    //Get Current Company partnership status both product and event
    //Get Prospect partnership type
    if (company != null) {

      if (!newCompany) {
        const lastRecord = await db.collection("Prospects")
          .find({ company_id: prospect.companyId.toString(), product_type_id: prospect.productId.toString() })
          .sort({ _id: -1 })
          .limit(1)
          .toArray();

        if (lastRecord.length > 0) {
          const prospectExpiresDate = new Date(lastRecord[0].date_expires);
          const currentDate = new Date();

          if (prospectExpiresDate > currentDate) {
            console.log("The expiration date is in the future.");

            await db.collection("Pending_Prospects").insertOne({
              company_id: prospect.companyId,
              product_type_id: prospect.productId,
              entity_id: entity_id,
              date_added: dateAdded,
              contactPersonName: prospect.contactPersonName,
              contactPersonNumber: prospect.contactPersonNumber,
              contactPersonEmail: prospect.contactPersonEmail,
              status: PROSPECT_VALUES[1].value,
            });

            return NextResponse.json({ error: "The expires on "+prospectExpiresDate+". Prospect Request Added to Queue " },
              { status: 200 });
          }

        }

      }

      //Create Prospect
      const prospectResult = await db.collection("Prospects").insertOne({
        company_id: prospect.companyId,
        product_type_id: prospect.productId,
        entity_id: entity_id,
        date_added: dateAdded,
        date_expires: dateExpires,
        contactPersonName: prospect.contactPersonName,
        contactPersonNumber: prospect.contactPersonNumber,
        contactPersonEmail: prospect.contactPersonEmail,
        status: PROSPECT_VALUES[5].value,
        newCompay: newCompany
      });

      return NextResponse.json({ success: true });
    }


    return NextResponse.json({ error: "Failed to update request" },
      { status: 500 });

  } catch (e) {
    console.error("Error updating request:", e);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}