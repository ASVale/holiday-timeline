"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import type { Holiday } from "@/data/types";
import type { GlobeMarkerData } from "./types";
import { GLOBE_CONFIG } from "@/lib/constants";
import { useHolidayStore } from "@/store/useHolidayStore";
import Globe3D from "./Globe3D";

interface GlobeViewProps {
  holidays: Holiday[];
  filteredHolidays: Holiday[];
}

export default function GlobeView({ holidays, filteredHolidays }: GlobeViewProps) {
  const router = useRouter();
  const { activeHolidayId, setActiveHolidayId } = useHolidayStore();
  const [hoveredHolidayId, setHoveredHolidayId] = useState<string | null>(null);
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
        const isHovered = holiday.id === hoveredHolidayId;
        const isActive = holiday.id === activeHolidayId;

        return {
          id: holiday.id,
          lat: holiday.coordinates.lat,
          lng: holiday.coordinates.lng,
          size: isFiltered
            ? GLOBE_CONFIG.markerSize * 0.5
            : isActive || isHovered
            ? GLOBE_CONFIG.activeMarkerSize
            : GLOBE_CONFIG.markerSize,
          color: isFiltered
            ? "#666666"
            : isActive || isHovered
            ? GLOBE_CONFIG.activeMarkerColor
            : GLOBE_CONFIG.markerColor,
          label: holiday.title,
          isActive: isActive || isHovered,
        };
      }),
    [holidays, activeHolidayId, hoveredHolidayId, filteredIds]
  );

  // Update tooltip position continuously when a holiday is displayed
  useEffect(() => {
    if (!hoveredHolidayId && !activeHolidayId) {
      setTooltipPosition(null);
      return;
    }

    const updatePosition = () => {
      const displayId = activeHolidayId || hoveredHolidayId;
      const markerElement = document.querySelector(`[data-marker-id="${displayId}"]`);

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
  }, [hoveredHolidayId, activeHolidayId]);

  // Handle marker hover
  const handleMarkerHover = (marker: GlobeMarkerData | null) => {
    setHoveredHolidayId(marker ? marker.id : null);
  };

  // Handle marker click - pin the card
  const handleMarkerClick = (holidayId: string) => {
    setActiveHolidayId(activeHolidayId === holidayId ? null : holidayId);
  };

  // Get the holiday to display (active or hovered)
  const displayedHolidayId = activeHolidayId || hoveredHolidayId;
  const displayedHoliday = displayedHolidayId
    ? holidays.find(h => h.id === displayedHolidayId)
    : null;

  const handleCardDoubleClick = () => {
    if (displayedHoliday) {
      router.push(`/holiday/${displayedHoliday.slug}`);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Fullscreen Globe */}
      <Globe3D
        markers={markers}
        focusPoint={null}
        onMarkerClick={handleMarkerClick}
        onMarkerHover={handleMarkerHover}
        className="w-full h-full"
      />

      {/* Tooltip Card positioned above marker */}
      <AnimatePresence>
        {displayedHoliday && tooltipPosition && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-auto"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%)',
            }}
            onDoubleClick={handleCardDoubleClick}
          >
            {/* Compact Holiday Card */}
            <div className="bg-surface rounded-lg overflow-hidden border border-accent shadow-2xl shadow-accent/30 w-80 cursor-pointer">
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
