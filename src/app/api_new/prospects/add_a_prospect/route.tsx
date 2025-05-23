import clientPromise from "@/app/lib/mongodb";
import { PROSPECT_VALUES } from "@/app/lib/values";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { error } from "console";
import { PROSPECT_EXPIRE_TIME_DURATION } from "@/app/lib/values";

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
    console.log("Request Body", req.body);
    let company = null;
    let newCompany = false;
    
    const prospect: IProspectRequest = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

   

    let createCompany = false;
    console.log("product type"  +prospect.producttype)
    // console.log("product ID"  +prospect.productId)


    // Map all other Product ID to the SameProduct ID except Event(6734053c308fd8d176381e07)
    // if (prospect.productId != "6734053c308fd8d176381e07") {
    //   prospect.productId = "6734054e308fd8d176381e08";
    // }
  if (prospect.productId === "" || prospect.productId === null||prospect.productId === undefined) {
        prospect.productId = prospect.producttype || "";
      }
   

    // Set current date as the date added
    const dateAdded = new Date();

    /* TODO*/
    //Fetch from Auth
    const entity_id = "675dbabf296393f677c5cf21";

    // Set date expires to three months from now
    const dateExpires = new Date();
    dateExpires.setTime(dateAdded.getTime() + PROSPECT_EXPIRE_TIME_DURATION);
    //correct this

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
              status: PROSPECT_VALUES[1].value,
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
        status: PROSPECT_VALUES[5].value,
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