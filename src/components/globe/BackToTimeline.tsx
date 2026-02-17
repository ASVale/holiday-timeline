"use client";

import { useHolidayStore } from "@/store/useHolidayStore";

export default function BackToTimeline() {
  const { setMode } = useHolidayStore();

  return (
    <button
      onClick={() => setMode("narrative")}
      className="px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20"
    >
      Back to Timeline
    </button>
  );
}
