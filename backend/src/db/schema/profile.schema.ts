import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  date,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  headline: varchar("headline", { length: 150 }),
  about: text("about"),
  skills: text("skills").array(),
  resumeUrl: varchar("resume_url", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  githubUrl: varchar("github_url", { length: 500 }),
  portfolioUrl: varchar("portfolio_url", { length: 500 }),
  openToWork: boolean("open_to_work").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  company: varchar("company", { length: 150 }).notNull(),
  location: varchar("location", { length: 255 }),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date"),
  isCurrent: boolean("is_current").default(false).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  degreeTitle: varchar("degree_title", { length: 150 }).notNull(),
  university: varchar("university", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date"),
  isCurrent: boolean("is_current").default(false).notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type WorkExperience = typeof workExperiences.$inferSelect;
export type NewWorkExperience = typeof workExperiences.$inferInsert;

export type Education = typeof educations.$inferSelect;
export type NewEducation = typeof educations.$inferInsert;
