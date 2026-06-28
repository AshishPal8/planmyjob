import { asc, eq } from "drizzle-orm";
import { db } from "../../db";
import {
  users,
  userProfiles,
  workExperiences,
  educations,
  type UserProfile,
  type WorkExperience,
  type Education,
} from "../../db/schema";
import { sanitizeUser } from "../../utils/user";
import type { UpdateProfileInput } from "./user.schema";

type ScoreField = { label: string; points: number; filled: boolean };

const calculateProfileScore = (
  user: typeof users.$inferSelect,
  profile: UserProfile | null,
  experienceRows: WorkExperience[],
  educationRows: Education[],
): { score: number; breakdown: Record<string, boolean> } => {
  const fields: ScoreField[] = [
    { label: "phone", points: 10, filled: !!user.phone },
    { label: "location", points: 10, filled: !!user.location },
    { label: "profilePicture", points: 5, filled: !!user.profilePicture },
    { label: "headline", points: 10, filled: !!profile?.headline },
    { label: "about", points: 15, filled: !!profile?.about },
    {
      label: "skills",
      points: 15,
      filled: (profile?.skills?.length ?? 0) > 0,
    },
    { label: "resumeUrl", points: 10, filled: !!profile?.resumeUrl },
    { label: "linkedinUrl", points: 5, filled: !!profile?.linkedinUrl },
    { label: "workExperience", points: 10, filled: experienceRows.length > 0 },
    { label: "education", points: 10, filled: educationRows.length > 0 },
  ];

  const score = fields
    .filter((f) => f.filled)
    .reduce((sum, f) => sum + f.points, 0);

  const breakdown = Object.fromEntries(fields.map((f) => [f.label, f.filled]));

  return { score, breakdown };
};

export const getFullProfile = async (userId: number) => {
  const [userRows, profileRows, experienceRows, educationRows] =
    await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).limit(1),
      db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1),
      db
        .select()
        .from(workExperiences)
        .where(eq(workExperiences.userId, userId))
        .orderBy(asc(workExperiences.fromDate)),
      db
        .select()
        .from(educations)
        .where(eq(educations.userId, userId))
        .orderBy(asc(educations.fromDate)),
    ]);

  const user = userRows[0];
  if (!user) return null;

  const profile = profileRows[0] ?? null;
  const { score, breakdown } = calculateProfileScore(
    user,
    profile,
    experienceRows,
    educationRows,
  );

  return {
    ...sanitizeUser(user),
    location: user.location,
    // flattened profile fields for easy frontend access
    headline: profile?.headline ?? null,
    about: profile?.about ?? null,
    skills: profile?.skills ?? [],
    resumeUrl: profile?.resumeUrl ?? null,
    linkedinUrl: profile?.linkedinUrl ?? null,
    githubUrl: profile?.githubUrl ?? null,
    portfolioUrl: profile?.portfolioUrl ?? null,
    openToWork: profile?.openToWork ?? false,
    // completion
    profileScore: score,
    profileScoreBreakdown: breakdown,
    // collections
    workExperiences: experienceRows,
    educations: educationRows,
  };
};

export const updateFullProfile = async (
  userId: number,
  input: UpdateProfileInput,
) => {
  const {
    name,
    phone,
    location,
    workExperiences: weInput,
    educations: eduInput,
    ...profileInput
  } = input;

  await db.transaction(async (tx) => {
    // 1. Update users table only for provided fields
    const userFields = {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(location !== undefined && { location }),
    };

    if (Object.keys(userFields).length > 0) {
      await tx
        .update(users)
        .set({ ...userFields, updatedAt: new Date() })
        .where(eq(users.id, userId));
    }

    // 2. Upsert user_profiles
    const profileFields = {
      ...(profileInput.headline !== undefined && {
        headline: profileInput.headline,
      }),
      ...(profileInput.about !== undefined && { about: profileInput.about }),
      ...(profileInput.skills !== undefined && { skills: profileInput.skills }),
      ...(profileInput.resumeUrl !== undefined && {
        resumeUrl: profileInput.resumeUrl,
      }),
      ...(profileInput.linkedinUrl !== undefined && {
        linkedinUrl: profileInput.linkedinUrl,
      }),
      ...(profileInput.githubUrl !== undefined && {
        githubUrl: profileInput.githubUrl,
      }),
      ...(profileInput.portfolioUrl !== undefined && {
        portfolioUrl: profileInput.portfolioUrl,
      }),
      ...(profileInput.openToWork !== undefined && {
        openToWork: profileInput.openToWork,
      }),
    };

    if (Object.keys(profileFields).length > 0) {
      await tx
        .insert(userProfiles)
        .values({ userId, ...profileFields })
        .onConflictDoUpdate({
          target: userProfiles.userId,
          set: { ...profileFields, updatedAt: new Date() },
        });
    }

    // 3. Full replace work experiences if provided
    if (weInput !== undefined) {
      await tx
        .delete(workExperiences)
        .where(eq(workExperiences.userId, userId));

      if (weInput.length > 0) {
        await tx.insert(workExperiences).values(
          weInput.map((we) => ({
            ...we,
            fromDate: we.fromDate.toISOString().slice(0, 10),
            toDate: we.toDate?.toISOString().slice(0, 10),
            userId,
          })),
        );
      }
    }

    // 4. Full replace educations if provided
    if (eduInput !== undefined) {
      await tx.delete(educations).where(eq(educations.userId, userId));

      if (eduInput.length > 0) {
        await tx.insert(educations).values(
          eduInput.map((edu) => ({
            ...edu,
            fromDate: edu.fromDate.toISOString().slice(0, 10),
            toDate: edu.toDate?.toISOString().slice(0, 10),
            percentage: edu.percentage?.toString(),
            userId,
          })),
        );
      }
    }
  });
};
