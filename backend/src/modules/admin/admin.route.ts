import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin, requireSuperAdmin } from "../../middleware/requireRole";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createManualJobSchema,
  updateManualJobSchema,
  getAdminJobsQuerySchema,
  updateUserRoleSchema,
  createCompanySchema,
  updateCompanySchema,
  updatePlatformSettingSchema,
} from "./admin.schema";
import {
  getStats,
  getJobs,
  getJobById,
  createJob,
  updateJob,
  toggleJobStatus,
  toggleJobFeatured,
  deleteJob,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  getCompanies,
  createCompany,
  updateCompany,
  toggleCompanyVerification,
  getSettings,
  updateSetting,
} from "./admin.controller";
import {
  triggerJSearch,
  triggerRemotive,
} from "../jobs/jobs.controller";

const router = Router();

// Protect all admin routes with requireAuth & requireAdmin
router.use(requireAuth);
router.use(requireAdmin);

// ─── Stats ───────────────────────────────────────────────────────────────────
router.get("/stats", getStats);

// ─── Jobs CRUD ───────────────────────────────────────────────────────────────
router.get("/jobs", validateRequest(getAdminJobsQuerySchema, "query"), getJobs);
router.get("/jobs/:id", getJobById);
router.post("/jobs", validateRequest(createManualJobSchema), createJob);
router.put("/jobs/:id", validateRequest(updateManualJobSchema), updateJob);
router.patch("/jobs/:id/status", toggleJobStatus);
router.patch("/jobs/:id/featured", toggleJobFeatured);
router.delete("/jobs/:id", deleteJob);

// ─── Scraper Triggers ────────────────────────────────────────────────────────
router.post("/scrapers/remotive", triggerRemotive);
router.post("/scrapers/jsearch", triggerJSearch);

// ─── Companies ───────────────────────────────────────────────────────────────
router.get("/companies", getCompanies);
router.post("/companies", validateRequest(createCompanySchema), createCompany);
router.put("/companies/:id", validateRequest(updateCompanySchema), updateCompany);
router.patch("/companies/:id/verify", toggleCompanyVerification);

// ─── Users & SuperAdmin Only Endpoints ───────────────────────────────────────
router.get("/users", requireSuperAdmin, getUsers);
router.patch(
  "/users/:id/role",
  requireSuperAdmin,
  validateRequest(updateUserRoleSchema),
  updateUserRole,
);
router.patch("/users/:id/status", requireSuperAdmin, toggleUserStatus);

// ─── Platform & Mailing Settings (SuperAdmin) ────────────────────────────────
router.get("/settings", requireSuperAdmin, getSettings);
router.post(
  "/settings",
  requireSuperAdmin,
  validateRequest(updatePlatformSettingSchema),
  updateSetting,
);

export default router;
