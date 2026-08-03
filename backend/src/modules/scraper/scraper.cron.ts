import cron from "node-cron";
import { fetchRemotiveJobs } from "./remotive.service";
import { fetchJSearchJobs } from "./jsearch.service";
import { saveJobsService, deactivateOldJobs } from "../jobs/jobs.service";
import { isFlagEnabled } from "../flags/flags.service";
import { CompanyMasterFlags } from "../flags/flags.constant";

const IST_TIMEZONE = "Asia/Kolkata";

const getIstHour = () =>
  Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: IST_TIMEZONE,
    }).format(new Date()),
  );

export const startScraperCron = () => {
  // 5am/9am/2pm/6pm IST — Remotive's own API notice caps usage at "max 4
  cron.schedule(
    "0 5,9,14,18 * * *",
    async () => {
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

        if (getIstHour() === 18) {
          await deactivateOldJobs(30);
        }
      } catch (error) {
        console.error("Scraper cron failed:", error);
      }
    },
    { timezone: IST_TIMEZONE },
  );

  console.log("Scraper cron registered — runs at 5AM, 9AM, 2PM, 6PM IST daily");
};
