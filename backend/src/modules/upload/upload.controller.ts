import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../utils/error";
import { uploadResumeSchema } from "./upload.schema";
import { uploadAndProcessResume, uploadFileService } from "./upload.service";

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

const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// magic bytes: actual file signature check — mimetype header can be spoofed
const MAGIC_BYTES: { bytes: number[]; offset?: number }[] = [
  { bytes: [0xff, 0xd8, 0xff] },                         // JPEG
  { bytes: [0x89, 0x50, 0x4e, 0x47] },                   // PNG
  { bytes: [0x52, 0x49, 0x46, 0x46] },                   // WEBP (RIFF)
  { bytes: [0x25, 0x50, 0x44, 0x46] },                   // PDF (%PDF)
  { bytes: [0x50, 0x4b, 0x03, 0x04] },                   // DOCX (ZIP/PK)
];

const isValidMagicBytes = (buffer: Buffer): boolean =>
  MAGIC_BYTES.some(({ bytes, offset = 0 }) =>
    bytes.every((b, i) => buffer[offset + i] === b),
  );

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    if (!ALLOWED_MIMETYPES.includes(req.file.mimetype)) {
      throw new BadRequestError(
        "Only images (JPEG, PNG, WEBP) and documents (PDF, DOCX) are allowed",
      );
    }

    if (req.file.size > 10 * 1024 * 1024) {
      throw new BadRequestError("File must be under 10MB");
    }

    if (!isValidMagicBytes(req.file.buffer)) {
      throw new BadRequestError("File content does not match its type");
    }

    const result = await uploadFileService(req.file);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
