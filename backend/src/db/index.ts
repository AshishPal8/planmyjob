import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set in .env");

// prepare: false — required for Neon's pooled ("-pooler") connection endpoint,
// which runs PgBouncer in transaction mode and doesn't support session-level
// prepared statements.
// max: 5 — small pool for this app's scale; fewer distinct connections means
// fewer that can go cold and pay Neon's compute-resume tax individually.
const client = postgres(connectionString, {
  ssl: "require",
  prepare: false,
  max: 5,
});
export const db = drizzle(client, { schema });
