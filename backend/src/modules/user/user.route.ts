import { Router } from "express";
import { getProfile, updateProfile } from "./user.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { updateProfileSchema } from "./user.schema";

const router = Router();

router.use(requireAuth);

router.get("/profile", getProfile);
router.put("/profile", validateRequest(updateProfileSchema), updateProfile);

export default router;
