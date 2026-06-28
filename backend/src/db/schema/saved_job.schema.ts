import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { jobs } from "./job.schema";

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    jobId: integer("job_id")
      .references(() => jobs.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.jobId)],
);

export type SavedJob = typeof savedJobs.$inferSelect;
