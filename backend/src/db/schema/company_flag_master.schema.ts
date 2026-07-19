import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const companyFlagMaster = pgTable("company_flag_master", {
  id: serial("id").primaryKey(),
  flagKey: varchar("flag_key", { length: 100 }).notNull().unique(),
  module: varchar("module", { length: 100 }),
  description: text("description"),
  // 0 = off, 1 = on
  isEnabled: integer("is_enabled").default(0).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CompanyFlagMaster = typeof companyFlagMaster.$inferSelect;
export type NewCompanyFlagMaster = typeof companyFlagMaster.$inferInsert;
