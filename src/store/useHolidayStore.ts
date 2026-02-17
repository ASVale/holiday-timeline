import { create } from "zustand";
import type { GeoPoint } from "@/data/types";

type InteractionMode = "narrative" | "explore";
type ViewMode = "timeline" | "globe";

interface HolidayStore {
  // View mode (timeline vs globe view)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Interaction mode
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;

  // Active holiday tracking
  activeHolidayId: string | null;
  setActiveHolidayId: (id: string | null) => void;

  // Globe focus
  focusPoint: GeoPoint | null;
  setFocusPoint: (point: GeoPoint | null) => void;

  // Scroll control flag
  isScrollingProgrammatically: boolean;
  setIsScrollingProgrammatically: (isScrolling: boolean) => void;

  // Lock flag to prevent scroll spy from changing activeHolidayId
  isActiveHolidayLocked: boolean;
  setIsActiveHolidayLocked: (isLocked: boolean) => void;

  // Filters
  activeFilters: string[];
  toggleFilter: (tag: string) => void;
  clearFilters: () => void;

  activeCountry: string | null;
  setActiveCountry: (country: string | null) => void;
}

export const useHolidayStore = create<HolidayStore>((set) => ({
  viewMode: "timeline",
  setViewMode: (viewMode) => set({ viewMode }),

  mode: "narrative",
  setMode: (mode) => set({ mode }),

  activeHolidayId: null,
  setActiveHolidayId: (id) => set({ activeHolidayId: id }),

  focusPoint: null,
  setFocusPoint: (point) => set({ focusPoint: point }),

  isScrollingProgrammatically: false,
  setIsScrollingProgrammatically: (isScrolling) => set({ isScrollingProgrammatically: isScrolling }),

  isActiveHolidayLocked: false,
  setIsActiveHolidayLocked: (isLocked) => set({ isActiveHolidayLocked: isLocked }),

  activeFilters: [],
  toggleFilter: (tag) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(tag)
        ? state.activeFilters.filter((t) => t !== tag)
        : [...state.activeFilters, tag],
    })),
  clearFilters: () => set({ activeFilters: [], activeCountry: null }),

  activeCountry: null,
  setActiveCountry: (country) => set({ activeCountry: country }),
}));
