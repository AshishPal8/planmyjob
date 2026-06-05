import { Router } from "express";
import {
  getJobs,
  getJobBySlug,
  triggerRemotive,
  triggerJSearch,
} from "./jobs.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { getJobsSchema } from "./jobs.schema";

const router = Router();

router.post("/match", validateRequest(getJobsSchema), getJobs);

router.post("/scrape/remotive", triggerRemotive);
router.post("/scrape/jsearch", triggerJSearch);

router.get("/:slug", getJobBySlug);

export default router;
