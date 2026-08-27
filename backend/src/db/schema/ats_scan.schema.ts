import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { jobs } from "./job.schema";

export interface ATSMetricDetail {
  id: string;
  name: string;
  score: number; // 0 - 100
  status: "pass" | "fail" | "warning";
  summary: string;
  findings: string[];
  tips: string[];
}

export interface ATSBulletSuggestion {
  original: string;
  improved: string;
  reason: string;
  metric?: string;
}

export interface ATSScanResult {
  overallScore: number;
  verdict: "Ready to Apply" | "Good Match" | "Needs Improvement" | "High Risk of Rejection";
  summaryText: string;
  targetRole: string;
  metrics: {
    bulletPoints: ATSMetricDetail;
    quantifiableMetrics: ATSMetricDetail;
    grammarAndTone: ATSMetricDetail;
    keywordsAndSkills: ATSMetricDetail;
    formattingAndHierarchy: ATSMetricDetail;
    contactInformation: ATSMetricDetail;
    brevityAndLength: ATSMetricDetail;
  };
  skillsFound: string[];
  missingKeywords: string[];
  bulletSuggestions: ATSBulletSuggestion[];
  generalSuggestions: string[];
  parsedResume: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    currentTitle?: string | null;
    experienceYears?: number | null;
    summary?: string | null;
    skills?: string[];
  };
}

export const atsScans = pgTable("ats_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  ipAddress: varchar("ip_address", { length: 100 }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  targetRole: varchar("target_role", { length: 150 }),
  targetJobId: integer("target_job_id").references(() => jobs.id),
  jobDescription: text("job_description"),
  overallScore: integer("overall_score").notNull(),
  verdict: varchar("verdict", { length: 50 }).notNull(),
  metrics: jsonb("metrics").notNull(),
  skillsFound: text("skills_found").array().default([]),
  missingKeywords: text("missing_keywords").array().default([]),
  bulletSuggestions: jsonb("bullet_suggestions").default([]),
  generalSuggestions: jsonb("general_suggestions").default([]),
  parsedResume: jsonb("parsed_resume"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ATSScan = typeof atsScans.$inferSelect;
export type NewATSScan = typeof atsScans.$inferInsert;
