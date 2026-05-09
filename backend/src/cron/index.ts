import { startScraperCron } from "../modules/scraper/scraper.cron";

export const startAllCrons = () => {
  startScraperCron();
};
