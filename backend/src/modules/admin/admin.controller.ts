import type { NextFunction, Request, Response } from "express";
import {
  getAdminStatsService,
  getAdminJobsService,
  getAdminJobByIdService,
  createManualJobService,
  updateManualJobService,
  toggleJobStatusService,
  toggleJobFeaturedService,
  deleteJobService,
  getAdminUsersService,
  updateUserRoleService,
  toggleUserStatusService,
  getAdminCompaniesService,
  createCompanyService,
  updateCompanyService,
  toggleCompanyVerificationService,
  getPlatformSettingsService,
  updatePlatformSettingService,
} from "./admin.service";

// ─── Stats ───────────────────────────────────────────────────────────────────
export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await getAdminStatsService();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// ─── Jobs ────────────────────────────────────────────────────────────────────
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getAdminJobsService(req.query as any);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const job = await getAdminJobByIdService(id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const job = await createManualJobService(req.body);
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const job = await updateManualJobService(id, req.body);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleJobStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const job = await toggleJobStatusService(id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Job ${job.isActive ? "activated" : "deactivated"} successfully`,
      data: { id: job.id, isActive: job.isActive },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleJobFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const job = await toggleJobFeaturedService(id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Job marked as ${job.isFeatured ? "featured" : "regular"}`,
      data: { id: job.id, isFeatured: job.isFeatured },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const job = await deleteJobService(id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    const result = await getAdminUsersService(page, pageSize, search, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;

    if (!id || !role) {
      res.status(400).json({ success: false, message: "Invalid input" });
      return;
    }

    const updated = await updateUserRoleService(id, role);
    if (!updated) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    const user = await toggleUserStatusService(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: { id: user.id, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Companies ───────────────────────────────────────────────────────────────
export const getCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const search = req.query.search as string | undefined;

    const result = await getAdminCompaniesService(page, pageSize, search);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const company = await createCompanyService(req.body);
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid company ID" });
      return;
    }

    const company = await updateCompanyService(id, req.body);
    if (!company) {
      res.status(404).json({ success: false, message: "Company not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCompanyVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Invalid company ID" });
      return;
    }

    const company = await toggleCompanyVerificationService(id);
    if (!company) {
      res.status(404).json({ success: false, message: "Company not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Company ${company.isVerified ? "verified" : "unverified"} successfully`,
      data: { id: company.id, isVerified: company.isVerified },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const getSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const settings = await getPlatformSettingsService();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { key, value, description } = req.body;
    if (!key || value === undefined) {
      res.status(400).json({ success: false, message: "Key and value are required" });
      return;
    }

    const result = await updatePlatformSettingService(
      key,
      value,
      description,
      req.user?.id,
    );

    res.status(200).json({
      success: true,
      message: "Setting saved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
