"use client";

import { useMemo, useEffect } from "react";
import { getHolidays } from "@/lib/data";
import { useGlobeSync } from "@/hooks/useGlobeSync";
import { useFilteredHolidays } from "@/hooks/useFilteredHolidays";
import { useHolidayStore } from "@/store/useHolidayStore";
import FilterBar from "@/components/layout/FilterBar";
import Timeline from "@/components/timeline/Timeline";
import GlobeContainer from "@/components/globe/GlobeContainer";

export default function HolidaysPage() {
  // Memoize holidays array to prevent recreation on every render
  const holidays = useMemo(() => getHolidays(), []);
  const filteredHolidays = useFilteredHolidays(holidays);
  const { setActiveHolidayId, activeHolidayId } = useHolidayStore();

  // Set first holiday as active on page load
  useEffect(() => {
    if (!activeHolidayId && filteredHolidays.length > 0) {
      setActiveHolidayId(filteredHolidays[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync globe rotation with timeline scroll
  useGlobeSync(filteredHolidays);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar with filters */}
      <div className="border-b border-gray-800 bg-surface/30 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <FilterBar />
        </div>
      </div>

      {/* Timeline View */}
      <div className="flex-1 md:grid md:grid-cols-2 overflow-hidden">
        {/* Timeline - Left Panel */}
        <div className="h-full overflow-hidden">
          <Timeline holidays={filteredHolidays} />
        </div>

        {/* Globe - Right Panel */}
        <div className="hidden md:block h-full overflow-hidden">
          <GlobeContainer holidays={holidays} filteredHolidays={filteredHolidays} />
        </div>
      </div>
    </div>
  );
}
