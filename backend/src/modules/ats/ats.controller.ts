import type { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "../../utils/error";
import { checkATSInputSchema } from "./ats.schema";
import {
  analyzeResumeForATS,
  getUserATSScans,
  getATSScanById,
} from "./ats.service";

// Binary Magic Byte Signatures for genuine file verification
const RESUME_MAGIC_BYTES: { bytes: number[]; offset?: number }[] = [
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

export const checkResumeATS = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError("Please upload a resume file (PDF or DOCX).");
    }

    if (req.file.size > 5 * 1024 * 1024) {
      throw new BadRequestError("Resume file size must be less than 5MB.");
    }

    if (!isValidMagicBytes(req.file.buffer, RESUME_MAGIC_BYTES)) {
      throw new BadRequestError(
        "Invalid file content. Uploaded file is not a valid PDF or DOCX document.",
      );
    }

    const inputValidation = checkATSInputSchema.safeParse(req.body);
    if (!inputValidation.success) {
      const errorMsg =
        inputValidation.error.issues[0]?.message || "Invalid input parameters";
      throw new BadRequestError(errorMsg);
    }

    const userId = req.user?.id;
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress;

    const result = await analyzeResumeForATS(
      req.file.buffer,
      req.file.originalname,
      inputValidation.data,
      userId,
      clientIp,
    );

    res.status(200).json({
      success: true,
      message: "ATS resume analysis completed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getScanHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const history = await getUserATSScans(userId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const getScanDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const scanId = parseInt(idParam || "", 10);
    if (isNaN(scanId)) {
      throw new BadRequestError("Invalid scan ID");
    }

    const userId = req.user?.id;
    const scan = await getATSScanById(scanId, userId);

    if (!scan) {
      throw new NotFoundError("ATS scan report not found");
    }

    res.status(200).json({ success: true, data: scan });
  } catch (error) {
    next(error);
  }
};
