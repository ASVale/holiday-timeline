import { memo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { useHolidayStore } from "@/store/useHolidayStore";
import type { Holiday } from "@/data/types";

interface HolidayCardProps {
  holiday: Holiday;
  isActive?: boolean;
}

function HolidayCard({ holiday, isActive }: HolidayCardProps) {
  const startDate = new Date(holiday.startDate);
  const endDate = new Date(holiday.endDate);
  const router = useRouter();
  const { setActiveHolidayId, setFocusPoint, setMode, setIsScrollingProgrammatically } = useHolidayStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = (e: React.MouseEvent) => {
    const targetHolidayId = holiday.id;
    setMode("narrative");
    setActiveHolidayId(targetHolidayId);
    setFocusPoint(holiday.coordinates);

    // Set flag to prevent scroll spy from interfering
    setIsScrollingProgrammatically(true);

    // Scroll the card to center of viewport
    const element = e.currentTarget as HTMLElement;
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // Clear flag after scroll animation completes
    setTimeout(() => {
      setIsScrollingProgrammatically(false);
      // Re-assert the correct holiday ID to handle edge case where last card can't center perfectly
      setActiveHolidayId(targetHolidayId);
    }, 1000);
  };

  const handleCardDoubleClick = () => {
    router.push(`/holiday/${holiday.slug}`);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? holiday.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      (prev + 1) % holiday.images.length
    );
  };

  const currentImage = holiday.images[currentImageIndex];

  return (
    <div
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
      className={clsx(
        "bg-surface rounded-lg overflow-hidden border transition-all duration-500 cursor-pointer",
        isActive
          ? "border-accent shadow-lg shadow-accent/20 scale-[1.02]"
          : "border-gray-800 hover:border-accent/50 hover:scale-[1.01]"
      )}
      data-holiday-id={holiday.id}
    >
      <div className="relative h-48 w-full group">
        <Image
          src={currentImage}
          alt={`${holiday.title} - Photo ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Photo Navigation Arrows */}
        {holiday.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image indicator dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {holiday.images.map((_, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    idx === currentImageIndex
                      ? "bg-accent w-3"
                      : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-6">
        <div className="text-sm text-accent mb-2">
          {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
        </div>
        <h3 className="text-xl font-bold mb-2">{holiday.title}</h3>
        <div className="text-sm text-gray-400 mb-3">
          {holiday.location}, {holiday.country}
        </div>
        <p className="text-gray-300 line-clamp-3">{holiday.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {holiday.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(HolidayCard);
