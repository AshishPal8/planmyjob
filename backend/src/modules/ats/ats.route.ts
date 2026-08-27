import { Router } from "express";
import multer from "multer";
import { optionalAuth } from "../../middleware/optionalAuth";
import {
  atsDailyLimiter,
  atsBurstLimiter,
} from "../../middleware/rateLimiter";
import {
  checkResumeATS,
  getScanHistory,
  getScanDetails,
} from "./ats.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Primary ATS Check endpoint with strict per-IP daily and burst limiters
router.post(
  "/check",
  atsDailyLimiter,
  atsBurstLimiter,
  optionalAuth,
  upload.single("resume"),
  checkResumeATS,
);

// Scan history for authenticated candidates
router.get("/history", optionalAuth, getScanHistory);

// Single scan details
router.get("/scan/:id", optionalAuth, getScanDetails);

export default router;
