import { ilike } from "drizzle-orm";
import { db } from "../../db";
import { skills, cities } from "../../db/schema";

export const searchSkills = async (query: string) => {
  return db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .where(ilike(skills.name, `%${query}%`))
    .limit(5);
};

export const searchCities = async (query: string) => {
  return db
    .select({ id: cities.id, name: cities.name, state: cities.state })
    .from(cities)
    .where(ilike(cities.name, `%${query}%`))
    .limit(5);
};
