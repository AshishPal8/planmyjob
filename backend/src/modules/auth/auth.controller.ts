import type { NextFunction, Request, Response } from "express";
import {
  exchangeGoogleCode,
  fetchGoogleProfile,
  findOrCreateGoogleUser,
} from "./auth.service";
import {
  clearAuthCookie,
  generateToken,
  setAuthCookie,
} from "../../utils/auth";
import { sanitizeUser } from "../../utils/user";
import { googleCallbackUrl, googleClientId } from "../../utils";

export const googleLogin = (req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: googleCallbackUrl,
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
    });

    setAuthCookie(res, genereteToken);

    res.status(200).json({
      success: true,
      token: genereteToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
