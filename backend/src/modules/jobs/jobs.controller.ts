import type { Request, Response, NextFunction } from "express";
import { fetchRemotiveJobs } from "../scraper/remotive.service";
import { fetchJSearchJobs } from "../scraper/jsearch.service";
import {
  getJobBySlugService,
  getJobsService,
  getSavedJobsService,
  saveJobsService,
  toggleSaveJobService,
  trackApplyJobService,
} from "./jobs.service";

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getJobsService(req.body, req.user?.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getJobBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const job = await getJobBySlugService(req.params.slug);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const saveJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);

    if (!jobId) {
      res.status(400).json({ success: false, message: "Invalid job id" });
      return;
    }

    const result = await toggleSaveJobService(userId, jobId);
    res.status(200).json({
      success: true,
      message: result.saved ? "Job saved" : "Job removed from saved",
      saved: result.saved,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getSavedJobsService(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const applyJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);

    if (!jobId) {
      res.status(400).json({ success: false, message: "Invalid job id" });
      return;
    }

    const result = await trackApplyJobService(userId, jobId);
    res.status(200).json({ success: true, applyCount: result.applyCount });
  } catch (error) {
    next(error);
  }
};

export const triggerRemotive = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jobs = await fetchRemotiveJobs();
    const saved = await saveJobsService(jobs);
    res.json({ success: true, fetched: jobs.length, saved });
  } catch (error) {
    next(error);
  }
};

export const triggerJSearch = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jobs = await fetchJSearchJobs();
    const saved = await saveJobsService(jobs);
    res.json({ success: true, fetched: jobs.length, saved });
  } catch (error) {
    next(error);
  }
};
