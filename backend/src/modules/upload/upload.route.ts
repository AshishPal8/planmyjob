import { Router } from "express";
import multer from "multer";
import { uploadResume } from "./upload.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { uploadResumeSchema } from "./upload.schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post("/", upload.single("resume"), uploadResume);

export default router;
