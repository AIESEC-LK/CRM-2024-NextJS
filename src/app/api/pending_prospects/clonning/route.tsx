import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

// PUT method to clone a pending prospect to the prospects collection using companyName
export async function PUT(req: Request) {
  const { companyName } = await req.json(); // Expecting the companyName of the pending prospect

  try {
    const client = await clientPromise;
    const db = client.db("CRM");

    // Find the pending prospect document by companyName
    const pendingProspect = await db
      .collection("Pending_Prospects")
      .findOne({ companyName });

    // If the pending prospect does not exist, return an error
    if (!pendingProspect) {
      return NextResponse.json(
        { error: "Pending prospect not found" },
        { status: 404 }
      );
    }

    // Check if a prospect already exists for the same companyName in the Prospects collection
    const existingProspect = await db
      .collection("Prospects")
      .findOne({ companyName });

    if (existingProspect) {
      // Check if the existing prospect's entity and producttype are empty
      if (!existingProspect.entity && !existingProspect.producttype) {
        // Update the existing prospect with data from the pending prospect
        await db.collection("Prospects").updateOne(
          { _id: existingProspect._id },
          {
            $set: {
              entity: pendingProspect.entity,
              companyName: pendingProspect.companyName,
              companyAddress: pendingProspect.companyAddress,
              contactPersonName: pendingProspect.contactPersonName,
              contactPersonNumber: pendingProspect.contactPersonNumber,
              contactPersonEmail: pendingProspect.contactPersonEmail,
              comment: pendingProspect.comment,
              industry: pendingProspect.industry,
              producttype: pendingProspect.producttype,
              status: "approved", // Set status to approved upon transfer
              dateAdded: pendingProspect.dateAdded,
              expireDate: pendingProspect.expireDate,
            },
          }
        );

        // Remove the prospect from the pending prospects collection
        await db.collection("Pending_Prospects").deleteOne({ companyName });

        return NextResponse.json({
          message: "Prospect updated and transferred successfully",
        });
      } else {
        return NextResponse.json(
          { message: "Prospect already exists with entity and producttype" },
          { status: 200 }
        );
      }
    } else {
      // If no existing prospect is found, insert a new one
      await db.collection("Prospects").insertOne({
        entity: pendingProspect.entity,
        companyName: pendingProspect.companyName,
        companyAddress: pendingProspect.companyAddress,
        contactPersonName: pendingProspect.contactPersonName,
        contactPersonNumber: pendingProspect.contactPersonNumber,
        contactPersonEmail: pendingProspect.contactPersonEmail,
        comment: pendingProspect.comment,
        industry: pendingProspect.industry,
        producttype: pendingProspect.producttype,
        status: "approved", // Set status to approved upon transfer
        dateAdded: pendingProspect.dateAdded,
        expireDate: pendingProspect.expireDate,
      });

      // Remove the prospect from the pending prospects collection
      await db.collection("Pending_Prospects").deleteOne({ companyName });

      // Return a success response
      return NextResponse.json({
        message: "Prospect inserted and transferred successfully",
      });
    }
  } catch (error) {
    console.error("Error cloning prospect:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
