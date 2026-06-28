import type { NextFunction, Request, Response } from "express";
import { getFullProfile, updateFullProfile } from "./user.service";
import type { UpdateProfileInput } from "./user.schema";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const profile = await getFullProfile(userId);
    if (!profile) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const input = req.body as UpdateProfileInput;

    await updateFullProfile(userId, input);

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};
