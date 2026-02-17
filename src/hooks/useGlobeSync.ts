import { useEffect } from "react";
import { useHolidayStore } from "@/store/useHolidayStore";
import type { Holiday } from "@/data/types";

export function useGlobeSync(holidays: Holiday[]) {
  const { activeHolidayId, setFocusPoint } = useHolidayStore();

  useEffect(() => {
    if (!activeHolidayId) return;

    const activeHoliday = holidays.find((h) => h.id === activeHolidayId);
    if (activeHoliday) {
      setFocusPoint(activeHoliday.coordinates);
    }
    // setFocusPoint is a stable Zustand action, no need to include in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHolidayId, holidays]);
}
