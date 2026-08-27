import { Router } from "express";
import multer from "multer";
import { uploadFile, uploadResume } from "./upload.controller";
import { requireAuth } from "../../middleware/requireAuth";
import {
  resumeParseDailyLimiter,
  resumeParseBurstLimiter,
  fileUploadLimiter,
} from "../../middleware/rateLimiter";

// Cap memory storage buffer at 5MB to defend against RAM exhaustion
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

const router = Router();

// Public resume upload + AI extraction with daily 10/day limit & burst protection
router.post(
  "/",
  resumeParseDailyLimiter,
  resumeParseBurstLimiter,
  upload.single("resume"),
  uploadResume,
);

// Authenticated simple file upload — image or document (rate-limited)
router.post(
  "/file",
  requireAuth,
  fileUploadLimiter,
  upload.single("file"),
  uploadFile,
);

export default router;
