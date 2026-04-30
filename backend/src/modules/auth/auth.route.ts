import { Router } from "express";
import { googleCallback, googleLogin, logout } from "./auth.controller";

const router = Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/logout", logout);

export default router;
