import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {
  try {
    const internalAuth = req.headers.get("x-internal-auth");

    if (internalAuth !== process.env.INTERNAL_AUTH_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const entityObjectId = new ObjectId(id);

    const checkEndpoints = [
      {
        url: `/api_new/prospects/get_prospect_in_entity_id?entity_id=${id}`,
        label: "Prospects",
      },
      {
        url: `/api_new/prospects/get_pending_prospect_in_entity_id?entity_id=${id}`,
        label: "Pending Prospects",
      },
      {
        url: `/api_new/prospects/get_deleted_prospect_in_entity_id?entity_id=${id}`,
        label: "Deleted Prospects",
      },
    ];

    for (const { url, label } of checkEndpoints) {
      const res = await fetch(process.env.BASE_URL + url, {
        headers: {
          "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET ?? "",
        },
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch ${label}`, details: res.statusText },
          { status: res.status }
        );
      }

      const data = await res.json();

      // ❗Only block deletion if actual data is present (not "not found" string)
      if (data && !data.response) {
        return NextResponse.json(
          { error: `${label} found for entity ${id}, cannot delete.` },
          { status: 402 }
        );
      }
    }

    // 🔍 Check for Users (this can return an array)
    const usersRes = await fetch(process.env.BASE_URL + `/api_new/user/get_user_by_entity_id?entity_id=${id}`, {
      headers: {
        "x-internal-auth": process.env.NEXT_PUBLIC_INTERNAL_AUTH_SECRET ?? "",
      },
    });

    if (!usersRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users", details: usersRes.statusText },
        { status: usersRes.status }
      );
    }

    const usersData = await usersRes.json();

    if (usersData && !usersData.response) {
      return NextResponse.json(
        { error: `Users found for entity ${id}, cannot delete.` },
        { status: 402 }
      );
    }

    // ✅ Proceed with deletion
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
