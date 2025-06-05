import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface User {
    email: string;
    role: 'member' | 'admin';
    lcId: string;
}
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {

        const internalAuth = req.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }


    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // Get email from query params

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Query the user by email
    const user = await db.collection("Users").findOne(
      { userEmail: email },
      { projection: { userEmail:1,userRole: 1, userEntityId: 1, _id: 0 } } // Only fetch required fields
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userObject: User = {
        email: user.userEmail,
        role: user.userRole,
        lcId: user.userEntityId,
    };

    return NextResponse.json(userObject); // Return the user details
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
