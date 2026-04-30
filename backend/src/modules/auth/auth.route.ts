import { Router } from "express";
import { googleCallback } from "./auth.controller";

const router = Router();

router.get("/google/callback", googleCallback);

export default router;
