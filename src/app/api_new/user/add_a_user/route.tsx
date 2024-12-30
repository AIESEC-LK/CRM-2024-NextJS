import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

interface IUserCreateRequest {
    userEmail: string;
    userRole: string;
    userEntityId: string;
}

export async function POST(req: Request) {
    try {

        const userCreateRequest: IUserCreateRequest = await req.json();
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Set current date as the date added
        const dateAdded = new Date();

        if (userCreateRequest.userEmail == "" || userCreateRequest.userRole == "" || userCreateRequest.userEntityId == "") {
            return NextResponse.json({ error: "Invalid Body Payload" },
                { status: 400 });
        }
        else {
            const userEntityId = await db.collection("Entities").findOne({ _id: new ObjectId(userCreateRequest.userEntityId.toString()) });
            if (!userEntityId) {
                return NextResponse.json({ error: "User Entity Not Found" },
                    { status: 400 });
            }
        }

        //Check whether the user already exists
        const user = await db.collection("Users").findOne({ userEmail: userCreateRequest.userEmail });
        if (user) {
            return NextResponse.json({ error: "User Already Exists" },
                { status: 400 });
        }

        const createUserResult = await db.collection("Users").insertOne({
            userEmail: userCreateRequest.userEmail,
            userRole: userCreateRequest.userRole,
            userEntityId: userCreateRequest.userEntityId,
            dateAdded: dateAdded
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json(
            { error: "Failed to update request" },
            { status: 500 }
        );
    }
}