import type { users } from "../db/schema";

export const sanitizeUser = (user: typeof users.$inferSelect) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profilePicture: user.profilePicture,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
};
