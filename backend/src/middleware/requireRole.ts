import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    try {
      let role = req.user.role;

      // If role not in token or to ensure fresh permissions, fetch from DB
      if (!role) {
        const user = await db
          .select({ role: users.role, isActive: users.isActive })
          .from(users)
          .where(eq(users.id, req.user.id))
          .limit(1);

        if (!user[0] || !user[0].isActive) {
          res.status(403).json({ success: false, message: "User account is inactive or not found" });
          return;
        }

        role = user[0].role;
        req.user.role = role;
      }

      // Superadmin has universal access
      if (role === "superadmin" || allowedRoles.includes(role)) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to access this resource",
      });
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = requireRole(["admin", "superadmin"]);
export const requireSuperAdmin = requireRole(["superadmin"]);
export const requireEmployer = requireRole(["employer", "admin", "superadmin"]);
