import { z } from "zod";

export const createManualJobSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  company: z.string().min(1, "Company name is required").max(150),
  companyId: z.number().int().positive().optional().nullable(),
  companyLogo: z.string().url().optional().nullable().or(z.literal("")),
  companyDomain: z.string().optional().nullable().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  workplaceType: z.enum(["remote", "hybrid", "on_site"]).default("remote"),
  jobType: z
    .enum([
      "full_time",
      "part_time",
      "contract",
      "freelance",
      "internship",
      "remote",
    ])
    .default("full_time"),
  experienceLevel: z
    .enum(["entry", "mid", "senior", "lead", "executive"])
    .optional()
    .nullable(),
  category: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  minSalary: z.number().int().nonnegative().optional().nullable(),
  maxSalary: z.number().int().nonnegative().optional().nullable(),
  salaryCurrency: z.string().default("USD").optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  description: z.string().min(10, "Job description must be at least 10 characters"),
  applyUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().nullable().or(z.string().optional().nullable()),
});

export const updateManualJobSchema = createManualJobSchema.partial();

export const getAdminJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
  source: z.enum(["all", "manual", "remotive", "jsearch", "remoteok"]).default("all"),
  jobType: z.string().optional(),
  category: z.string().optional(),
  isFeatured: z.enum(["all", "true", "false"]).default("all"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["job_seeker", "employer", "admin", "superadmin"]),
});

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(150),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  website: z.string().url().optional().nullable().or(z.literal("")),
  domain: z.string().optional().nullable().or(z.literal("")),
  industry: z.string().optional().nullable(),
  companySize: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  isVerified: z.boolean().default(false),
  ownerId: z.number().int().positive().optional().nullable(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const updatePlatformSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  description: z.string().optional(),
});

export type CreateManualJobInput = z.infer<typeof createManualJobSchema>;
export type UpdateManualJobInput = z.infer<typeof updateManualJobSchema>;
export type GetAdminJobsQuery = z.infer<typeof getAdminJobsQuerySchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
