import {
  pgTable,
  serial,
  integer,
  real,
  varchar,
  text,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileId: varchar("file_id", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  extractedName: varchar("extracted_name", { length: 100 }),
  extractedEmail: varchar("extracted_email", { length: 255 }),
  extractedPhone: varchar("extracted_phone", { length: 20 }),
  currentTitle: varchar("current_title", { length: 150 }),
  experienceYears: real("experience_years"),
  education: text("education"),
  summary: text("summary"),
  skills: text("skills").array(),
  extractedData: jsonb("extracted_data"),
  isProcessed: boolean("is_processed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
