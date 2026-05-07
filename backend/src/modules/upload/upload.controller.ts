import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../utils/error";
import { uploadResumeSchema } from "./upload.schema";
import { uploadAndProcessResume } from "./upload.service";

export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const validation = uploadResumeSchema.safeParse({
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    if (!validation.success) {
      throw new BadRequestError("Invalid file");
    }

    const resume = await uploadAndProcessResume(req.file);

    res.status(200).json({
      success: true,
      data: {
        skills: resume.skills,
        currentTitle: resume.currentTitle,
        experienceYears: resume.experienceYears,
        summary: resume.summary,
      },
    });
  } catch (error) {
    next(error);
  }
};
