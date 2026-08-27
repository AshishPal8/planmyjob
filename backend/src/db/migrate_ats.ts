import { sql } from "drizzle-orm";
import { db } from "./index";

async function main() {
  console.log("Creating ats_scans table if not exists...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ats_scans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      ip_address VARCHAR(100),
      file_name VARCHAR(255) NOT NULL,
      target_role VARCHAR(150),
      target_job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
      job_description TEXT,
      overall_score INTEGER NOT NULL,
      verdict VARCHAR(50) NOT NULL,
      metrics JSONB NOT NULL,
      skills_found TEXT[] DEFAULT '{}',
      missing_keywords TEXT[] DEFAULT '{}',
      bullet_suggestions JSONB DEFAULT '[]',
      general_suggestions JSONB DEFAULT '[]',
      parsed_resume JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ats_scans_user_id ON ats_scans(user_id);
    CREATE INDEX IF NOT EXISTS idx_ats_scans_created_at ON ats_scans(created_at DESC);
  `);
  console.log("✅ ats_scans table created/verified successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
