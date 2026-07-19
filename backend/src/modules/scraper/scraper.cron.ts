import cron from "node-cron";
import { fetchRemotiveJobs } from "./remotive.service";
import { fetchJSearchJobs } from "./jsearch.service";
import { saveJobsService, deactivateOldJobs } from "../jobs/jobs.service";
import { isFlagEnabled } from "../flags/flags.service";
import { CompanyMasterFlags } from "../flags/flags.constant";

export const startScraperCron = () => {
  cron.schedule("0 7,18 * * *", async () => {
    // cron.schedule("*/2 * * * *", async () => {
    const enabled = await isFlagEnabled(CompanyMasterFlags.START_JOB_CRON);
    if (!enabled) {
      console.log(
        `Scraper cron skipped — "${CompanyMasterFlags.START_JOB_CRON}" flag is disabled`,
      );
      return;
    }

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
