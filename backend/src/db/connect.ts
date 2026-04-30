import { sql } from "drizzle-orm";
import { db } from "./index";

export const connectDB = async (): Promise<void> => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
