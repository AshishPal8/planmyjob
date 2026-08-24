import { and, desc, eq, ilike, or, sql, count } from "drizzle-orm";
import { db } from "../../db";
import {
  jobs,
  users,
  companies,
  jobApplications,
  platformSettings,
  resumes,
} from "../../db/schema";
import { generateSlug } from "../../utils/generateSlug";
import type {
  CreateManualJobInput,
  UpdateManualJobInput,
  GetAdminJobsQuery,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "./admin.schema";

// ─── Stats ───────────────────────────────────────────────────────────────────
export const getAdminStatsService = async () => {
  const [
    totalJobsResult,
    activeJobsResult,
    manualJobsResult,
    scrapedJobsResult,
    totalUsersResult,
    totalApplicationsResult,
    totalCompaniesResult,
  ] = await Promise.all([
    db.select({ value: count() }).from(jobs).where(eq(jobs.isDeleted, false)),
    db
      .select({ value: count() })
      .from(jobs)
      .where(and(eq(jobs.isDeleted, false), eq(jobs.isActive, true))),
    db
      .select({ value: count() })
      .from(jobs)
      .where(and(eq(jobs.isDeleted, false), eq(jobs.source, "manual"))),
    db
      .select({ value: count() })
      .from(jobs)
      .where(and(eq(jobs.isDeleted, false), sql`${jobs.source} != 'manual'`)),
    db.select({ value: count() }).from(users).where(eq(users.isDeleted, false)),
    db.select({ value: count() }).from(jobApplications),
    db
      .select({ value: count() })
      .from(companies)
      .where(eq(companies.isDeleted, false)),
  ]);

  return {
    totalJobs: Number(totalJobsResult[0]?.value ?? 0),
    activeJobs: Number(activeJobsResult[0]?.value ?? 0),
    inactiveJobs:
      Number(totalJobsResult[0]?.value ?? 0) -
      Number(activeJobsResult[0]?.value ?? 0),
    manualJobs: Number(manualJobsResult[0]?.value ?? 0),
    scrapedJobs: Number(scrapedJobsResult[0]?.value ?? 0),
    totalUsers: Number(totalUsersResult[0]?.value ?? 0),
    totalApplications: Number(totalApplicationsResult[0]?.value ?? 0),
    totalCompanies: Number(totalCompaniesResult[0]?.value ?? 0),
  };
};

// ─── Jobs Management ─────────────────────────────────────────────────────────
export const getAdminJobsService = async (query: GetAdminJobsQuery) => {
  const {
    page,
    pageSize,
    search,
    status,
    source,
    jobType,
    category,
    isFeatured,
  } = query;

  const conditions = [eq(jobs.isDeleted, false)];

  if (status === "active") conditions.push(eq(jobs.isActive, true));
  if (status === "inactive") conditions.push(eq(jobs.isActive, false));

  if (source && source !== "all") {
    conditions.push(eq(jobs.source, source as any));
  }

  if (jobType) {
    conditions.push(eq(jobs.jobType, jobType as any));
  }

  if (category) {
    conditions.push(ilike(jobs.category, `%${category}%`));
  }

  if (isFeatured === "true") conditions.push(eq(jobs.isFeatured, true));
  if (isFeatured === "false") conditions.push(eq(jobs.isFeatured, false));

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(jobs.title, term),
        ilike(jobs.company, term),
        ilike(jobs.location, term),
      )!,
    );
  }

  const whereClause = and(...conditions);
  const offset = (page - 1) * pageSize;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(jobs)
      .where(whereClause)
      .orderBy(desc(jobs.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ value: count() }).from(jobs).where(whereClause),
  ]);

  const total = Number(totalResult[0]?.value ?? 0);
  const totalPages = Math.ceil(total / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const getAdminJobByIdService = async (id: number) => {
  const result = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.isDeleted, false)))
    .limit(1);

  return result[0] || null;
};

export const createManualJobService = async (input: CreateManualJobInput) => {
  let baseSlug = generateSlug(input.title, input.company);
  let finalSlug = baseSlug;
  let counter = 1;

  // Ensure unique slug
  while (true) {
    const existing = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.slug, finalSlug))
      .limit(1);

    if (!existing.length) break;
    finalSlug = `${baseSlug}-${counter++}`;
  }

  const values: typeof jobs.$inferInsert = {
    title: input.title,
    slug: finalSlug,
    company: input.company,
    companyId: input.companyId ?? null,
    companyLogo: input.companyLogo ?? null,
    companyDomain: input.companyDomain ?? null,
    location: input.location ?? null,
    workplaceType: input.workplaceType,
    jobType: input.jobType,
    experienceLevel: input.experienceLevel ?? null,
    category: input.category ?? null,
    salary: input.salary ?? null,
    minSalary: input.minSalary ?? null,
    maxSalary: input.maxSalary ?? null,
    salaryCurrency: input.salaryCurrency ?? "USD",
    skills: input.skills,
    description: input.description,
    applyUrl: input.applyUrl ?? null,
    source: "manual",
    isFeatured: input.isFeatured ?? false,
    isActive: input.isActive !== undefined ? input.isActive : true,
    isDeleted: false,
    postedAt: new Date(),
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
  };

  const created = await db.insert(jobs).values(values).returning();
  return created[0]!;
};

export const updateManualJobService = async (
  id: number,
  input: UpdateManualJobInput,
) => {
  const { expiresAt, ...rest } = input;
  const updateData: Partial<typeof jobs.$inferInsert> = {
    ...rest,
    updatedAt: new Date(),
  };

  if (expiresAt !== undefined) {
    updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
  }

  const updated = await db
    .update(jobs)
    .set(updateData)
    .where(and(eq(jobs.id, id), eq(jobs.isDeleted, false)))
    .returning();

  return updated[0] || null;
};


export const toggleJobStatusService = async (id: number) => {
  const job = await getAdminJobByIdService(id);
  if (!job) return null;

  const updated = await db
    .update(jobs)
    .set({
      isActive: !job.isActive,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return updated[0] || null;
};

export const toggleJobFeaturedService = async (id: number) => {
  const job = await getAdminJobByIdService(id);
  if (!job) return null;

  const updated = await db
    .update(jobs)
    .set({
      isFeatured: !job.isFeatured,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return updated[0] || null;
};

export const deleteJobService = async (id: number) => {
  const updated = await db
    .update(jobs)
    .set({
      isDeleted: true,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return updated[0] || null;
};

// ─── User Management ─────────────────────────────────────────────────────────
export const getAdminUsersService = async (
  page = 1,
  pageSize = 10,
  search?: string,
  role?: string,
) => {
  const conditions = [eq(users.isDeleted, false)];

  if (role && role !== "all") {
    conditions.push(eq(users.role, role as any));
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(
      or(ilike(users.name, term), ilike(users.email, term))!,
    );
  }

  const whereClause = and(...conditions);
  const offset = (page - 1) * pageSize;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profilePicture: users.profilePicture,
        role: users.role,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ value: count() }).from(users).where(whereClause),
  ]);

  const total = Number(totalResult[0]?.value ?? 0);
  const totalPages = Math.ceil(total / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

export const updateUserRoleService = async (userId: number, role: string) => {
  const updated = await db
    .update(users)
    .set({
      role: role as any,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated[0] || null;
};

export const toggleUserStatusService = async (userId: number) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) return null;

  const updated = await db
    .update(users)
    .set({
      isActive: !user[0].isActive,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated[0] || null;
};

// ─── Company Management ──────────────────────────────────────────────────────
export const getAdminCompaniesService = async (
  page = 1,
  pageSize = 10,
  search?: string,
) => {
  const conditions = [eq(companies.isDeleted, false)];

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(
      or(ilike(companies.name, term), ilike(companies.domain, term))!,
    );
  }

  const whereClause = and(...conditions);
  const offset = (page - 1) * pageSize;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(companies)
      .where(whereClause)
      .orderBy(desc(companies.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ value: count() }).from(companies).where(whereClause),
  ]);

  const total = Number(totalResult[0]?.value ?? 0);
  const totalPages = Math.ceil(total / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

export const createCompanyService = async (input: CreateCompanyInput) => {
  const baseSlug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let finalSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.slug, finalSlug))
      .limit(1);

    if (!existing.length) break;
    finalSlug = `${baseSlug}-${counter++}`;
  }

  const created = await db
    .insert(companies)
    .values({
      name: input.name,
      slug: finalSlug,
      logoUrl: input.logoUrl ?? null,
      website: input.website ?? null,
      domain: input.domain ?? null,
      industry: input.industry ?? null,
      companySize: input.companySize ?? null,
      location: input.location ?? null,
      about: input.about ?? null,
      isVerified: input.isVerified ?? false,
      ownerId: input.ownerId ?? null,
      isActive: true,
      isDeleted: false,
    })
    .returning();

  return created[0]!;
};

export const updateCompanyService = async (
  id: number,
  input: UpdateCompanyInput,
) => {
  const updated = await db
    .update(companies)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(companies.id, id), eq(companies.isDeleted, false)))
    .returning();

  return updated[0] || null;
};

export const toggleCompanyVerificationService = async (id: number) => {
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.id, id))
    .limit(1);

  if (!company[0]) return null;

  const updated = await db
    .update(companies)
    .set({
      isVerified: !company[0].isVerified,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, id))
    .returning();

  return updated[0] || null;
};

// ─── Platform Settings ───────────────────────────────────────────────────────
export const getPlatformSettingsService = async () => {
  const settingsList = await db.select().from(platformSettings);
  const settingsMap: Record<string, any> = {};

  for (const s of settingsList) {
    settingsMap[s.key] = s.value;
  }

  return settingsMap;
};

export const updatePlatformSettingService = async (
  key: string,
  value: any,
  description?: string,
  updatedBy?: number,
) => {
  const existing = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, key))
    .limit(1);

  if (existing.length > 0) {
    const updated = await db
      .update(platformSettings)
      .set({
        value,
        description: description ?? existing[0]!.description,
        updatedBy: updatedBy ?? existing[0]!.updatedBy,
        updatedAt: new Date(),
      })
      .where(eq(platformSettings.key, key))
      .returning();

    return updated[0]!;
  }

  const created = await db
    .insert(platformSettings)
    .values({
      key,
      value,
      description: description ?? null,
      updatedBy: updatedBy ?? null,
    })
    .returning();

  return created[0]!;
};
