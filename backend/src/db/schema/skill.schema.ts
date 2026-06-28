import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export type Skill = typeof skills.$inferSelect;
