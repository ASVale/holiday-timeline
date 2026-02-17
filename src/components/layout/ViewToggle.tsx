"use client";

import { useHolidayStore } from "@/store/useHolidayStore";
import clsx from "clsx";

export default function ViewToggle() {
  const { viewMode, setViewMode } = useHolidayStore();

  return (
    <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setViewMode("timeline")}
        className={clsx(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          viewMode === "timeline"
            ? "bg-accent text-background"
            : "text-gray-300 hover:text-white"
        )}
      >
        Timeline View
      </button>
      <button
        onClick={() => setViewMode("globe")}
        className={clsx(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          viewMode === "globe"
            ? "bg-accent text-background"
            : "text-gray-300 hover:text-white"
        )}
      >
        Globe View
      </button>
    </div>
  );
}
