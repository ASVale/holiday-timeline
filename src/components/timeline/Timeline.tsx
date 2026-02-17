"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Holiday } from "@/data/types";
import { useHolidayStore } from "@/store/useHolidayStore";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import HolidayCard from "./HolidayCard";
import TimelineConnector from "./TimelineConnector";

interface TimelineProps {
  holidays: Holiday[];
}

export default function Timeline({ holidays }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeHolidayId, mode } = useHolidayStore();

  // Set up scroll spy to track active card
  useScrollSpy(containerRef);

  // Helper to check if we should show year label
  const shouldShowYear = (holiday: Holiday, index: number) => {
    if (index === 0) return true;
    const currentYear = new Date(holiday.startDate).getFullYear();
    const prevYear = new Date(holidays[index - 1].startDate).getFullYear();
    return currentYear !== prevYear;
  };

  return (
    <motion.div
      ref={containerRef}
      className="h-full overflow-y-auto"
      style={{ scrollPaddingTop: "50vh", scrollPaddingBottom: "50vh" }}
      animate={{
        opacity: mode === "explore" ? 0.3 : 1,
        pointerEvents: mode === "explore" ? "none" : "auto",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto py-12 px-4">
        {holidays.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No holidays match your filters</p>
          </div>
        ) : (
          <div className="space-y-0">
            <AnimatePresence mode="popLayout">
              {holidays.map((holiday, index) => {
                const showYear = shouldShowYear(holiday, index);
                const year = new Date(holiday.startDate).getFullYear();

                return (
                  <motion.div
                    key={holiday.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Year label */}
                      <div className="w-16 flex-shrink-0 pt-4">
                        {showYear && (
                          <div className="text-2xl font-bold text-accent">
                            {year}
                          </div>
                        )}
                      </div>

                      {/* Card */}
                      <div className="flex-1">
                        <HolidayCard
                          holiday={holiday}
                          isActive={holiday.id === activeHolidayId}
                        />
                      </div>
                    </div>
                    {index < holidays.length - 1 && <TimelineConnector />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
