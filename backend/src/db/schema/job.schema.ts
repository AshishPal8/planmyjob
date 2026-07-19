import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";


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
  "manual",
]);

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),

    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),

    company: text("company").notNull(),
    companyLogo: text("company_logo"),
    companyDomain: text("company_domain"),
    location: text("location"),
    description: text("description"),
    skills: text("skills").array(),

    salary: text("salary"),

    jobType: jobTypeEnum("job_type"),
    category: text("category"),
    applyUrl: text("apply_url"),

    source: jobSourceEnum("job_source").notNull().default("manual"),
    sourceId: text("source_id").unique(),
    sourceUrl: text("source_url"),

    applyCount: integer("apply_count").default(0).notNull(),

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
