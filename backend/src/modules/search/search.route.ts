import { Router } from "express";
import { getCitySuggestions, getSkillSuggestions } from "./search.controller";

const router = Router();

router.get("/skills", getSkillSuggestions);
router.get("/cities", getCitySuggestions);

export default router;
