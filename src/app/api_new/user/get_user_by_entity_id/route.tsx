import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const entity_id = searchParams.get("entity_id");
  
    if (!entity_id) {
      return NextResponse.json({ error: "Entity ID is required" }, { status: 400 });
    }
  
    try {
      const internalAuth = request.headers.get("x-internal-auth");
  
      // ✅ Allow internal fetches (server-to-server) if they include a valid secret
      if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME);
      const collection = db.collection("Users"); // Change to your actual collection name
  
      const user = await collection.findOne({userEntityId : entity_id });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json(
        { 
          error: "Internal Server Error", 
          details: error instanceof Error ? error.message : String(error) 
        },
        { status: 500 }
      );
    }
  }