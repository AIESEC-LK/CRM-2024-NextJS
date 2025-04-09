import clientPromise from "@/app/lib/mongodb";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { error } from "console";
import { PROSPECT_EXPIRE_TIME_DURATION } from "@/app/lib/values";


// Shape of a Prospect Request
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
  userLcId: string;
  producttype: string | undefined;
}

// Shape of a Product
interface IProspectProduct{
  _id: string;
  productName: string;
  abbravation: string;
  product:boolean
}


export async function POST(req: Request) {
  try {
    let company = null;
    let newCompany = false;
    
    // Parse the request body as JSON
    const prospect: IProspectRequest = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    let createCompany = false;

    // Map all other Product ID to the SameProduct ID except Event(6734053c308fd8d176381e07)
    if (prospect.productId === "" || prospect.productId === null||prospect.productId === undefined) {
        prospect.productId = prospect.producttype || "";
      }
   

    // Set current date as the date added
    const dateAdded = new Date();


    //Fetch from Auth
    const entity_id = prospect.userLcId;
   
    // Configure the Expire Date
    const dateExpires = new Date();
    dateExpires.setTime(dateAdded.getTime() + PROSPECT_EXPIRE_TIME_DURATION);

    //Check whether the company already exists
    if (prospect.companyId == "" || prospect.companyId == null) {

      //Create a new company bcz it's a new company
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
      const prospectProduct = await db.collection("Products").findOne({ _id: new ObjectId(prospect.productId.toString()) }) as IProspectProduct | null;


      if (!newCompany) {

        const lastRecord = await db.collection("Prospects")
  .find({ company_id: prospect.companyId.toString() })
  .sort({ _id: -1 })
  .toArray();

  console.log("Last record:", lastRecord);

if (lastRecord.length > 0 || lastRecord!=null) {
  let shouldBePending = false;
  
  // Use for...of instead of forEach for async operations
  for (const record of lastRecord) {
    try {
      const recordProductID = record.product_type_id;
      const recordProduct = await db.collection("Products").findOne({ 
        _id: new ObjectId(recordProductID.toString()) 
      }) as IProspectProduct | null;
      
      const recordExpiresDate = new Date(record.date_expires);
      const currentDate = new Date();

      console.log("Checking record:", {
        recordId: record._id,
        expiryDate: recordExpiresDate,
        currentDate: currentDate,
        prospectProduct: prospectProduct?.productName,
        recordProduct: recordProduct?.productName
      });

      if (recordExpiresDate > currentDate) {
        if (prospectProduct?.product === recordProduct?.product) {
          shouldBePending = true;
          break; // Exit the loop once we find a match
        }
      }
    } catch (error) {
      console.error("Error processing record:", error);
      console.error("Record details:", {
        recordId: record._id,
        productId: record.product_type_id
      });
    }
  }

  console.log("Final decision:", {
    shouldBePending,
    prospectProductName: prospectProduct?.productName
  });


          console.log("Should be pending" + shouldBePending)

          // const lastRecordProductID = lastRecord[0].product_type_id;
          // const lastRecordProduct = await db.collection("Products").findOne({ _id: new ObjectId(lastRecordProductID.toString()) }) as IProspectProduct | null;
          // const prospectExpiresDate = new Date(lastRecord[0].date_expires);
          // const currentDate = new Date();


          if (shouldBePending) {

            if (prospect.productId === "" || prospect.productId === null||prospect.productId === undefined) {
              prospect.productId = prospect.producttype || "";
            }
            console.log("product ID"  +prospect.productId)
            await db.collection("Pending_Prospects").insertOne({
              company_id: prospect.companyId,
              product_type_id: prospect.productId,
              entity_id: entity_id,
              date_added: dateAdded,
              contactPersonName: prospect.contactPersonName,
              contactPersonNumber: prospect.contactPersonNumber,
              contactPersonEmail: prospect.contactPersonEmail,
              status: PROSPECT_VALUES[0].value,
            });
            

            return NextResponse.json({ error: "Prospect Request Added to Queue " },
              { status: 200 });


          }else{

            console.log("product ID"  +prospect.productId)

            if (prospect.productId === "" || prospect.productId === null||prospect.productId === undefined) {
              prospect.productId = prospect.producttype || "";
            }
            console.log("product ID dfsdfsd"  +prospect.productId)
        await db.collection("Prospects").insertOne({
          company_id: prospect.companyId,
          product_type_id: prospect.productId,
          entity_id: entity_id,
          date_added: dateAdded,
          date_expires: dateExpires,
          contactPersonName: prospect.contactPersonName,
          contactPersonNumber: prospect.contactPersonNumber,
          contactPersonEmail: prospect.contactPersonEmail,
          status: createCompany ? PROSPECT_VALUES[7].value : PROSPECT_VALUES[1].value,
          newCompay: newCompany
        });

        return NextResponse.json({ success: true });

      }

      }


    }else{
      //Create Prospect
      if (prospect.productId === "" || prospect.productId === null||prospect.productId === undefined) {
        prospect.productId = prospect.producttype || "";
      }

      console.log("product ID"  +prospect.productId)
      await db.collection("Prospects").insertOne({
        company_id: prospect.companyId,
        product_type_id: prospect.productId,
        entity_id: entity_id,
        date_added: dateAdded,
        date_expires: dateExpires,
        contactPersonName: prospect.contactPersonName,
        contactPersonNumber: prospect.contactPersonNumber,
        contactPersonEmail: prospect.contactPersonEmail,
        status: newCompany ? PROSPECT_VALUES[7].value : PROSPECT_VALUES[1].value,
        newCompay: newCompany
      });

      return NextResponse.json({ success: true });
      
    }
  }

    return NextResponse.json({ error: error },
      { status: 500 });
      
  } catch (e) {
    console.error("Error updating request:", Error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}