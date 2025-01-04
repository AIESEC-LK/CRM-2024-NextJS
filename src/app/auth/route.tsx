import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessTokenFromOauth } from "@/app/auth/auth-utils";
import { GetTokenResponse } from "@/app/auth/auth-types";
import { getUserEmail } from "@/utils/person-utils";
import clientPromise from "../lib/mongodb";

export async function GET(request: NextRequest) {
  const code: string = request.nextUrl.searchParams.get("code") as string;
  const authResponse: GetTokenResponse = await getAccessTokenFromOauth(code);

  const redirectCookie = cookies().get("redirect_uri");
  const redirect_uri =
    redirectCookie && redirectCookie.value
      ? redirectCookie.value
      : `${process.env.NEXT_PUBLIC_BASE_URL}/`;
  console.log("Redirect URI:", redirect_uri);

  const userEmail = await getUserEmail(authResponse.access_token);
  console.log("📩 User Email:", userEmail);

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const user = await db.collection("Users").findOne({ userEmail: userEmail });

    if (user) {
      console.log("✅ User found:", user);
    } else {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }
  } catch (e) {
    console.error("Error fetching requests:", e);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }

  const response = NextResponse.redirect(redirect_uri, { status: 302 });

  response.cookies.set("email", userEmail, {
    httpOnly: true,
    secure: true,
    maxAge: authResponse.expires_in,
  });

  response.cookies.set("access_token", authResponse.access_token, {
    httpOnly: true,
    secure: true,
    maxAge: authResponse.expires_in,
  });
  response.cookies.set("refresh_token", authResponse.refresh_token, {
    httpOnly: true,
    secure: true,
  });

  return response;
}


