import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { companies } from "./company.schema";

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
  "remote",
]);

export const jobSourceEnum = pgEnum("job_source", [
  "remotive",
  "jsearch",
  "remoteok",
  "manual",
]);

export const workplaceTypeEnum = pgEnum("workplace_type", [
  "remote",
  "hybrid",
  "on_site",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
]);

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),

    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),

    company: text("company").notNull(),
    companyId: integer("company_id").references(() => companies.id),
    companyLogo: text("company_logo"),
    companyDomain: text("company_domain"),
    location: text("location"),
    description: text("description"),
    skills: text("skills").array(),

    salary: text("salary"),
    minSalary: integer("min_salary"),
    maxSalary: integer("max_salary"),
    salaryCurrency: varchar("salary_currency", { length: 10 }).default("USD"),

    jobType: jobTypeEnum("job_type"),
    workplaceType: workplaceTypeEnum("workplace_type").default("remote"),
    experienceLevel: experienceLevelEnum("experience_level"),
    category: text("category"),
    applyUrl: text("apply_url"),

    source: jobSourceEnum("job_source").notNull().default("manual"),
    sourceId: text("source_id").unique(),
    sourceUrl: text("source_url"),

    applyCount: integer("apply_count").default(0).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),

    isActive: boolean("is_active").default(true).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),

    postedAt: timestamp("posted_at"),
    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    // every jobs query filters on these two — speeds up filtering as the table grows
    index("jobs_active_deleted_idx").on(t.isActive, t.isDeleted),
    // speeds up skills array-overlap matching (matchJobsToSkills' `&&` query)
    index("jobs_skills_gin_idx").using("gin", t.skills),
  ],
);

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

