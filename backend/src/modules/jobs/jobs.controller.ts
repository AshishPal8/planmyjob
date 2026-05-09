import type { Request, Response, NextFunction } from "express";
import { fetchRemotiveJobs } from "../scraper/remotive.service";
import { fetchJSearchJobs } from "../scraper/jsearch.service";
import { getJobsService, saveJobsService } from "./jobs.service";

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getJobsService(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const triggerRemotive = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jobs = await fetchRemotiveJobs();
    const saved = await saveJobsService(jobs);

    res.json({
      success: true,
      fetched: jobs.length,
      saved,
    });
  } catch (error) {
    next(error);
  }
};

export const triggerJSearch = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jobs = await fetchJSearchJobs();
    const saved = await saveJobsService(jobs);

    res.json({
      success: true,
      fetched: jobs.length,
      saved,
    });
  } catch (error) {
    next(error);
  }
};
