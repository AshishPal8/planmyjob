import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { companyFlagMaster } from "../../db/schema";
import type { CompanyMasterFlags } from "./flags.constant";

type FlagKey = (typeof CompanyMasterFlags)[keyof typeof CompanyMasterFlags];

export const isFlagEnabled = async (flagKey: FlagKey): Promise<boolean> => {
  const [flag] = await db
    .select({ isEnabled: companyFlagMaster.isEnabled })
    .from(companyFlagMaster)
    .where(
      and(
        eq(companyFlagMaster.flagKey, flagKey),
        eq(companyFlagMaster.isDeleted, false),
      ),
    )
    .limit(1);

  return flag?.isEnabled === 1;
};
