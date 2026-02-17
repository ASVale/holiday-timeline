"use client";

import { motion } from "framer-motion";
import { useHolidayStore } from "@/store/useHolidayStore";
import { getAllTags } from "@/lib/data";
import clsx from "clsx";

export default function FilterBar() {
  const { activeFilters, toggleFilter, clearFilters } = useHolidayStore();
  const allTags = getAllTags();

  // Show only top 6 most relevant tags
  const topTags = ["Asia", "Culture", "Nature", "Adventure", "Beach", "Hiking"];
  const displayTags = allTags.filter(tag => topTags.includes(tag)).slice(0, 6);

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="border-b border-gray-800 bg-surface/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-sm text-gray-400 flex-shrink-0">
            Filter by:
          </span>

          <div className="flex gap-2 flex-wrap">
            {displayTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeFilters.includes(tag)
                    ? "bg-accent text-background"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="ml-auto flex-shrink-0 text-sm text-accent hover:text-accent/80 underline"
            >
              Clear filters
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
