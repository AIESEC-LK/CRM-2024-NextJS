import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {


        const internalAuth = request.headers.get("x-internal-auth");

    // ✅ Allow internal fetches (server-to-server) if they include a valid secret
    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
    }


        const { searchParams } = new URL(request.url);
        const entity_id = searchParams.get("entity_id")?.toString();

        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        const prospects = await db.collection("Users").aggregate([
            {
                $lookup: {
                    from: "Entities",
                    let: { entityId: "$userEntityId" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$entityId"] } } },
                        { $project: { _id: 1, entityName: 1 } }
                    ],
                    as: "entity"
                }
            },
            {
                $unwind: {
                    path: "$entity",
                    preserveNullAndEmptyArrays: true // In case there is no matching entity, the field will be null
                }
            },
            {
                $project: {
                    _id: 1,
                    entity: 1,
                    userRole: 1,       // Include the userRole field from Users
                    userEmail: 1
                }
            }
        ]).toArray();


        return NextResponse.json(prospects);
    } catch (e) {
        console.error("Error fetching requests:", e);
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
}
