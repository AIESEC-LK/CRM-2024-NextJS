import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const entityObjectId = new ObjectId(id);

    // Check if there are prospects associated with this entity
    const prospectsResponse = await fetch(process.env.BASE_URL + `/prospects/get_prospect_in_entity_id?entity_id=${id}`, {
      headers: {
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET ?? "",
      },
    });

    if (!prospectsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prospects", details: prospectsResponse.statusText },
        { status: prospectsResponse.status }
      );
    }

    const prospectsData = await prospectsResponse.json();

    // If prospects exist, prevent deletion
    if (prospectsData) {
      return NextResponse.json(
        { error: `Prospects found for entity ${id}, cannot delete.` },
        { status: 402 }
      );
    }

    // Check if there are pending prospects associated with this entity
    const pendingProspectsResponse = await fetch(process.env.BASE_URL + `/prospects/get_pending_prospect_in_entity_id?entity_id=${id}`, {
      headers: {
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET ?? "",
      },
    });

    if (!pendingProspectsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prospects", details: pendingProspectsResponse.statusText },
        { status: pendingProspectsResponse.status }
      );
    }

    const pendingProspectsData = await pendingProspectsResponse.json();

    // If pending prospects exist, prevent deletion
    if (pendingProspectsData) {
      return NextResponse.json(
        { error: `Pending Prospects found for entity ${id}, cannot delete.` },
        { status: 402 }
      );
    }

    // Check if there are deleted prospects associated with this entity
    const deletedProspectsResponse = await fetch(process.env.BASE_URL + `/prospects/get_deleted_prospect_in_entity_id?entity_id=${id}`, {
      headers: {
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET ?? "",
      },
    });

    if (!deletedProspectsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prospects", details: deletedProspectsResponse.statusText },
        { status: deletedProspectsResponse.status }
      );
    }
    const deletedProspectsData = await deletedProspectsResponse.json();
    // If deleted prospects exist, prevent deletion
    if (deletedProspectsData) {
      return NextResponse.json(
        { error: `Deleted Prospects found for entity ${id}, cannot delete.` },
        { status: 402 }
      );
    }

    // Check if the users exist
    const usersResponse = await fetch(process.env.BASE_URL + `/users/get_users_in_entity_id?entity_id=${id}`, {
      headers: {
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET ?? "",
      },
    });

    if (!usersResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users", details: usersResponse.statusText },
        { status: usersResponse.status }
      );
    }
    const usersData = await usersResponse.json();
    // If users exist, prevent deletion
    if (usersData && usersData.length > 0) {
      return NextResponse.json(
        { error: `Users found for entity ${id}, cannot delete.` },
        { status: 402 }
      );
    }

    // Proceed with deletion
    const result = await db.collection("Entities").deleteOne({ _id: entityObjectId });

    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "No records deleted" });
  } catch (e) {
    console.error("Error deleting entity:", e);
    return NextResponse.json({ error: "Failed to delete entity" }, { status: 500 });
  }
}
