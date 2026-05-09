import { Router } from "express";
import { getJobs, triggerRemotive, triggerJSearch } from "./jobs.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { getJobsSchema } from "./jobs.schema";

const router = Router();

router.post("/match", validateRequest(getJobsSchema), getJobs);

// manual trigger endpoints for testing scraper services
router.post("/scrape/remotive", triggerRemotive);
router.post("/scrape/jsearch", triggerJSearch);

export default router;
