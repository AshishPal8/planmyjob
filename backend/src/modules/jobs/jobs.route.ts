import { Router } from "express";
import {
  applyJob,
  getAppliedJobs,
  getJobBySlug,
  getJobSlugsForSitemap,
  getJobs,
  getSavedJobs,
  saveJob,
  triggerJSearch,
  triggerRemotive,
} from "./jobs.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { getJobsSchema } from "./jobs.schema";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireRole";
import { optionalAuth } from "../../middleware/optionalAuth";

const router = Router();

// match — works for both auth and non-auth users
router.post("/match", optionalAuth, validateRequest(getJobsSchema), getJobs);

// saved jobs — must come before /:slug
router.get("/saved", requireAuth, getSavedJobs);

// applied jobs — must come before /:slug
router.get("/applied", requireAuth, getAppliedJobs);

// sitemap feed — must come before /:slug
router.get("/sitemap/all", getJobSlugsForSitemap);

// save / unsave toggle
router.post("/save/:jobId", requireAuth, saveJob);

// track apply click
router.post("/apply/:jobId", requireAuth, applyJob);

// scraper triggers (protected — Admin only)
router.post("/scrape/remotive", requireAuth, requireAdmin, triggerRemotive);
router.post("/scrape/jsearch", requireAuth, requireAdmin, triggerJSearch);

// job detail
router.get("/:slug", optionalAuth, getJobBySlug);

export default router;
