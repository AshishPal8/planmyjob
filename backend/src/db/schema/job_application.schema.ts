import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { jobs } from "./job.schema";

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    jobId: integer("job_id")
      .references(() => jobs.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.jobId)],
);

export type JobApplication = typeof jobApplications.$inferSelect;
