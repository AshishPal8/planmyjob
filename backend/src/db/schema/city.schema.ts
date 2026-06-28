import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
});

export type City = typeof cities.$inferSelect;
