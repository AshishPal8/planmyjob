import type { NextFunction, Request, Response } from "express";
import { searchSkills, searchCities } from "./search.service";

export const getSkillSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const q = (req.query.q as string | undefined)?.trim() ?? "";

    if (!q) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const data = await searchSkills(q);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCitySuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const q = (req.query.q as string | undefined)?.trim() ?? "";

    if (!q) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const data = await searchCities(q);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
