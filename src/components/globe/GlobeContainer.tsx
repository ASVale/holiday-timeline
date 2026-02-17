"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import type { Holiday } from "@/data/types";
import type { GlobeMarkerData } from "./types";
import { GLOBE_CONFIG } from "@/lib/constants";
import { useHolidayStore } from "@/store/useHolidayStore";
import Globe3D from "./Globe3D";
import BackToTimeline from "./BackToTimeline";

interface GlobeContainerProps {
  holidays: Holiday[];
  filteredHolidays: Holiday[];
}

export default function GlobeContainer({ holidays, filteredHolidays }: GlobeContainerProps) {
  const router = useRouter();
  const { focusPoint, activeHolidayId, mode, setMode, setActiveHolidayId, setFocusPoint, setIsScrollingProgrammatically, setIsActiveHolidayLocked } =
    useHolidayStore();

  // Hover state for tooltip
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarkerData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const filteredIds = useMemo(
    () => new Set(filteredHolidays.map((h) => h.id)),
    [filteredHolidays]
  );

  const markers: GlobeMarkerData[] = useMemo(
    () =>
      holidays.map((holiday) => {
        const isFiltered = !filteredIds.has(holiday.id);
        // marker stays stable across selections to prevent DOM churn and flicker
        return {
          id: holiday.id,
          lat: holiday.coordinates.lat,
          lng: holiday.coordinates.lng,
          size: isFiltered ? GLOBE_CONFIG.markerSize * 0.5 : GLOBE_CONFIG.markerSize,
          color: isFiltered ? "#666666" : GLOBE_CONFIG.markerColor,
          label: holiday.title,
        };
      }),
    [holidays, filteredIds]
  );

  // Update tooltip position when hovering or when active holiday changes
  useEffect(() => {
    // Determine which holiday to show tooltip for (hover takes priority)
    const displayHolidayId = hoveredMarker?.id || activeHolidayId;

    if (!displayHolidayId) {
      setTooltipPosition(null);
      return;
    }

    const updatePosition = () => {
      const markerElement = document.querySelector(`[data-marker-id="${displayHolidayId}"]`);

      if (markerElement) {
        const rect = markerElement.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current?.offsetHeight || 200;

        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - tooltipHeight - 10,
        });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 50);
    return () => clearInterval(interval);
  }, [hoveredMarker, activeHolidayId]);

  // Clear hovered marker when active holiday changes
  useEffect(() => {
    setHoveredMarker(null);
  }, [activeHolidayId]);

  // Handle marker hover
  const handleMarkerHover = useCallback((marker: GlobeMarkerData | null) => {
    setHoveredMarker(marker);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (holidayId: string) => {
      const holiday = holidays.find((h) => h.id === holidayId);
      if (!holiday) return;

      setMode("narrative");
      setActiveHolidayId(holidayId);
      setFocusPoint(holiday.coordinates);

      // Set both flags: prevent scroll spy interference AND lock the active holiday
      setIsScrollingProgrammatically(true);
      setIsActiveHolidayLocked(true);

      // Scroll to the card centered in timeline
      setTimeout(() => {
        const element = document.querySelector(`[data-holiday-id="${holidayId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Clear programmatic scroll flag after animation
        setTimeout(() => {
          setIsScrollingProgrammatically(false);
        }, 1000);

        // Keep the lock longer to ensure the correct card stays highlighted
        // This handles the edge case where the last card can't center perfectly
        setTimeout(() => {
          setActiveHolidayId(holidayId);
          setIsActiveHolidayLocked(false);
        }, 2000);
      }, 100);
    },
    [holidays, setMode, setActiveHolidayId, setFocusPoint, setIsScrollingProgrammatically, setIsActiveHolidayLocked]
  );

  // Get holiday to display in tooltip (hover takes priority over active)
  const displayHolidayId = hoveredMarker?.id || activeHolidayId;
  const displayedHoliday = displayHolidayId
    ? holidays.find(h => h.id === displayHolidayId)
    : null;

  const handleTooltipClick = () => {
    if (displayedHoliday) {
      // Single click: activate holiday and scroll timeline to it
      const targetHolidayId = displayedHoliday.id;
      setMode("narrative");
      setActiveHolidayId(targetHolidayId);
      setFocusPoint(displayedHoliday.coordinates);

      // Set both flags: prevent scroll spy interference AND lock the active holiday
      setIsScrollingProgrammatically(true);
      setIsActiveHolidayLocked(true);

      // Scroll to the card centered in timeline
      setTimeout(() => {
        const element = document.querySelector(`[data-holiday-id="${targetHolidayId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Clear programmatic scroll flag after animation
        setTimeout(() => {
          setIsScrollingProgrammatically(false);
        }, 1000);

        // Keep the lock longer to ensure the correct card stays highlighted
        // This handles the edge case where the last card can't center perfectly
        setTimeout(() => {
          setActiveHolidayId(targetHolidayId);
          setIsActiveHolidayLocked(false);
        }, 2000);
      }, 100);
    }
  };

  const handleTooltipDoubleClick = () => {
    if (displayedHoliday) {
      router.push(`/holiday/${displayedHoliday.slug}`);
    }
  };

  return (
    <div className="relative h-full">
      <Globe3D
        markers={markers}
        focusPoint={focusPoint}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={handleMarkerHover}
        className="w-full h-full"
      />

      {mode === "explore" && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <BackToTimeline />
        </div>
      )}

      {/* Tooltip Card for hover or active holiday */}
      <AnimatePresence>
        {displayedHoliday && tooltipPosition && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%)',
            }}
          >
            <div
              className="bg-surface rounded-lg overflow-hidden border border-accent shadow-2xl shadow-accent/30 w-80 pointer-events-auto cursor-pointer"
              onClick={handleTooltipClick}
              onDoubleClick={handleTooltipDoubleClick}
            >
              <div className="relative h-32 w-full">
                <Image
                  src={displayedHoliday.images[0]}
                  alt={displayedHoliday.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-accent mb-1">
                  {format(new Date(displayedHoliday.startDate), "MMM d, yyyy")} - {format(new Date(displayedHoliday.endDate), "MMM d, yyyy")}
                </div>
                <h3 className="text-base font-bold mb-1">{displayedHoliday.title}</h3>
                <div className="text-xs text-gray-400 mb-2">
                  {displayedHoliday.location}, {displayedHoliday.country}
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{displayedHoliday.description}</p>
              </div>

              {/* Pointer arrow */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  bottom: '-10px',
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #f59e0b',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
