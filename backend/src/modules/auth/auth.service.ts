import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import type { GoogleUser } from "./auth.schema";
import { envConfig } from "../../config/env.config";

export const exchangeGoogleCode = async (code: string) => {
  const params = new URLSearchParams({
    code,
    client_id: envConfig.google.clientId,
    client_secret: envConfig.google.clientSecret,
    redirect_uri: envConfig.google.callbackUrl,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Google code for token");
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
};

export const fetchGoogleProfile = async (
  accessToken: string,
): Promise<GoogleUser> => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google profile");
  }

  const profile = (await response.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  return {
    googleId: profile.id,
    email: profile.email,
    name: profile.name,
    profilePicture: profile.picture,
  };
};

export const findOrCreateGoogleUser = async (googleUser: GoogleUser) => {
  const { email, name, profilePicture, googleId } = googleUser;

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing[0]) {
    const updated = await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        profilePicture: profilePicture ?? existing[0].profilePicture,
        googleId: googleId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing[0].id))
      .returning();

    return updated[0]!;
  }

  const newUser = await db
    .insert(users)
    .values({
      email,
      name,
      profilePicture,
      googleId: googleUser.googleId,
    })
    .returning();

  return newUser[0]!;
};
