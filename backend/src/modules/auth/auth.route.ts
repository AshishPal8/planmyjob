import { Router } from "express";
import { googleCallback, googleLogin, logout, me } from "./auth.controller";

const router = Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/logout", logout);
router.get("/me", me);

export default router;
