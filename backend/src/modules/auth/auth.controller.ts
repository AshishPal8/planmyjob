import type { NextFunction, Request, Response } from "express";
import {
  exchangeGoogleCode,
  fetchGoogleProfile,
  findOrCreateGoogleUser,
} from "./auth.service";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import {
  clearAuthCookie,
  generateToken,
  setAuthCookie,
  verifyToken,
} from "../../utils/auth";
import { sanitizeUser } from "../../utils/user";
import { envConfig } from "../../config/env.config";

export const googleLogin = (req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id: envConfig.google.clientId,
    redirect_uri: envConfig.google.callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { code } = req.query as { code: string };

    const accessToken = await exchangeGoogleCode(code);
    const googleProfile = await fetchGoogleProfile(accessToken);
    const user = await findOrCreateGoogleUser(googleProfile);

    const genereteToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, genereteToken);
    res.redirect(`${envConfig.frontendUrl}/profile`);
  } catch (error) {
    next(error);
  }
};


export const logout = (req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1);

    if (!userRecord[0]) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user: sanitizeUser(userRecord[0]) });
  } catch (error) {
    next(error);
  }
};
