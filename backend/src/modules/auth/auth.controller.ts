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
