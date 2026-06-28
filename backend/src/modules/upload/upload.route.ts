import { Router } from "express";
import multer from "multer";
import { uploadFile, uploadResume } from "./upload.controller";
import { requireAuth } from "../../middleware/requireAuth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

// resume upload + AI extraction (existing)
router.post("/", upload.single("resume"), uploadResume);

// simple file upload — returns url only (image or document)
router.post("/file", requireAuth, upload.single("file"), uploadFile);

export default router;
