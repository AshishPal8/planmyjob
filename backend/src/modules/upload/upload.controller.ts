import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../utils/error";
import { uploadResumeSchema } from "./upload.schema";
import { uploadAndProcessResume, uploadFileService } from "./upload.service";

// Binary Magic Byte Signatures for genuine file verification
const RESUME_MAGIC_BYTES: { bytes: number[]; offset?: number }[] = [
  { bytes: [0x25, 0x50, 0x44, 0x46] }, // PDF (%PDF)
  { bytes: [0x50, 0x4b, 0x03, 0x04] }, // DOCX (PK ZIP)
];

const ALL_ALLOWED_MAGIC_BYTES: { bytes: number[]; offset?: number }[] = [
  { bytes: [0xff, 0xd8, 0xff] }, // JPEG
  { bytes: [0x89, 0x50, 0x4e, 0x47] }, // PNG
  { bytes: [0x52, 0x49, 0x46, 0x46] }, // WEBP (RIFF)
  { bytes: [0x25, 0x50, 0x44, 0x46] }, // PDF (%PDF)
  { bytes: [0x50, 0x4b, 0x03, 0x04] }, // DOCX (PK ZIP)
];

const isValidMagicBytes = (
  buffer: Buffer,
  allowedList: { bytes: number[]; offset?: number }[],
): boolean =>
  allowedList.some(({ bytes, offset = 0 }) =>
    bytes.every((b, i) => buffer[offset + i] === b),
  );

export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError("No resume file uploaded");
    }

    // 1. Zod MIME type & size check
    const validation = uploadResumeSchema.safeParse({
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || "Invalid resume file";
      throw new BadRequestError(msg);
    }

    // 2. Binary Magic Bytes verification (prevents header spoofing attacks)
    if (!isValidMagicBytes(req.file.buffer, RESUME_MAGIC_BYTES)) {
      throw new BadRequestError(
        "Invalid file content. The uploaded file is not a valid PDF or DOCX document.",
      );
    }

    // 3. Process & Extract with Gemini AI + ImageKit
    const resume = await uploadAndProcessResume(req.file);

    res.status(200).json({
      success: true,
      data: {
        skills: resume.skills,
        currentTitle: resume.currentTitle,
        experienceYears: resume.experienceYears,
        summary: resume.summary,
        isProcessed: resume.isProcessed,
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

    if (req.file.size > 5 * 1024 * 1024) {
      throw new BadRequestError("File must be under 5MB");
    }

    if (!isValidMagicBytes(req.file.buffer, ALL_ALLOWED_MAGIC_BYTES)) {
      throw new BadRequestError(
        "File content does not match its declared type",
      );
    }

    const result = await uploadFileService(req.file);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
