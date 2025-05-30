import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface IUserUpdateRequest {
    _id: string;
    userEmail: string;
    userRole?: string; // Optional fields for updating (you may or may not update them)
    userEntityId?: string;
}

export async function PUT(req: NextRequest) {
    try {

        const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }


        const userUpdateRequest: IUserUpdateRequest = await req.json();
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Ensure that the userEmail is provided as it is essential for identifying the user
        if (!userUpdateRequest._id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Validate if userEntityId is provided, and if so, check if it exists in the "Entities" collection
        if (userUpdateRequest.userEntityId) {
            const userEntityId = await db.collection("Entities").findOne({ _id: new ObjectId(userUpdateRequest.userEntityId) });
            if (!userEntityId) {
                return NextResponse.json({ error: "User Entity Not Found" }, { status: 400 });
            }
        }

        // Find the user by email
        const user = await db.collection("Users").findOne({ userEmail: userUpdateRequest.userEmail });
        if (!user) {
            return NextResponse.json({ error: "User Not Found" }, { status: 400 });
        }

        // Prepare update data
        const updateData: { [key: string]: any } = {};
        if (userUpdateRequest.userRole) {
            updateData.userRole = userUpdateRequest.userRole;
        }
        if (userUpdateRequest.userEntityId) {
            updateData.userEntityId = userUpdateRequest.userEntityId;
        }

        // Update the user in the database
        const updateUserResult = await db.collection("Users").updateOne(
            { userEmail: userUpdateRequest.userEmail },
            { $set: updateData }
        );

        if (updateUserResult.modifiedCount === 0) {
            return NextResponse.json({ error: "No changes made" }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
