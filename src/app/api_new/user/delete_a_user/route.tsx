import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Handler for DELETE requests to delete a user by userId (passed in query params)
export async function DELETE(req: NextRequest) {
    try {

        const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }


        // Extract the query parameters from the URL
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId"); // Get 'userId' from the query params

        // Ensure the userId is provided and is valid
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Ensure the userId is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        // Find the user by _id
        const user = await db.collection("Users").findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return NextResponse.json({ error: "User Not Found" }, { status: 404 });
        }

        // Delete the user by _id
        const deleteResult = await db.collection("Users").deleteOne({ _id: new ObjectId(userId) });

        // Check if the deletion was successful
        if (deleteResult.deletedCount === 0) {
            return NextResponse.json({ error: "Failed to delete user" }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Error deleting user:", e);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
