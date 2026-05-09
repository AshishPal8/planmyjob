import cron from "node-cron";
import { fetchRemotiveJobs } from "./remotive.service";
import { fetchJSearchJobs } from "./jsearch.service";
import { saveJobsService, deactivateOldJobs } from "../jobs/jobs.service";

export const startScraperCron = () => {
  // cron.schedule("0 8,20 * * *", async () => {
  cron.schedule("*/2 * * * *", async () => {
    console.log("Scraper cron started:", new Date().toISOString());

    try {
      const [remotiveJobs, jsearchJobs] = await Promise.allSettled([
        fetchRemotiveJobs(),
        fetchJSearchJobs(),
      ]);

      const allJobs = [
        ...(remotiveJobs.status === "fulfilled" ? remotiveJobs.value : []),
        ...(jsearchJobs.status === "fulfilled" ? jsearchJobs.value : []),
      ];

      await saveJobsService(allJobs);

      const hour = new Date().getHours();
      if (hour === 20) {
        await deactivateOldJobs(30);
      }
    } catch (error) {
      console.error("Scraper cron failed:", error);
    }
  });

  console.log("Scraper cron registered — runs at 8AM and 8PM daily");
};
