import { format } from "date-fns";
import type { Holiday } from "@/data/types";
import PhotoGallery from "./PhotoGallery";

interface HolidayContentProps {
  holiday: Holiday;
}

export default function HolidayContent({ holiday }: HolidayContentProps) {
  const startDate = new Date(holiday.startDate);
  const endDate = new Date(holiday.endDate);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">{holiday.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-400">
          <div className="flex items-center gap-2">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {holiday.location}, {holiday.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-accent">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {format(startDate, "MMM d, yyyy")} -{" "}
              {format(endDate, "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery images={holiday.images} title={holiday.title} />

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">About this trip</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {holiday.description}
        </p>
      </div>

      {/* Highlights */}
      {holiday.highlights && holiday.highlights.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Highlights</h2>
          <ul className="space-y-2">
            {holiday.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {holiday.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
