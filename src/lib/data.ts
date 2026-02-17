import { holidays } from "@/data/holidays";
import type { Holiday } from "@/data/types";

export function getHolidays(): Holiday[] {
  // Return holidays in reverse chronological order (newest first)
  return [...holidays].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export function getHolidayBySlug(slug: string): Holiday | undefined {
  return holidays.find((holiday) => holiday.slug === slug);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  holidays.forEach((holiday) => {
    holiday.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getAllCountries(): string[] {
  const countrySet = new Set<string>();
  holidays.forEach((holiday) => {
    countrySet.add(holiday.country);
  });
  return Array.from(countrySet).sort();
}
