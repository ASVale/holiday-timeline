import { useMemo } from "react";
import { useHolidayStore } from "@/store/useHolidayStore";
import type { Holiday } from "@/data/types";

export function useFilteredHolidays(holidays: Holiday[]): Holiday[] {
  const { activeFilters, activeCountry } = useHolidayStore();

  return useMemo(() => {
    let filtered = holidays;

    // Filter by tags
    if (activeFilters.length > 0) {
      filtered = filtered.filter((holiday) =>
        activeFilters.some((filter) => holiday.tags.includes(filter))
      );
    }

    // Filter by country
    if (activeCountry) {
      filtered = filtered.filter(
        (holiday) => holiday.country === activeCountry
      );
    }

    return filtered;
  }, [holidays, activeFilters, activeCountry]);
}
