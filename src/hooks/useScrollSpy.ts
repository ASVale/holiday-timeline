import { useEffect } from "react";
import { useHolidayStore } from "@/store/useHolidayStore";

export function useScrollSpy(containerRef: React.RefObject<HTMLElement | null>) {
  const { setActiveHolidayId, isScrollingProgrammatically, isActiveHolidayLocked } = useHolidayStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      // Skip if programmatic scroll is in progress or active holiday is locked
      if (isScrollingProgrammatically || isActiveHolidayLocked) return;

      // Edge case: If scrolled to top, activate first card
      if (container.scrollTop <= 50) {
        const firstCard = container.querySelector("[data-holiday-id]");
        const holidayId = firstCard?.getAttribute("data-holiday-id");
        if (holidayId) {
          setActiveHolidayId(holidayId);
        }
        return;
      }

      // Edge case: If scrolled to bottom, activate last card
      // This ensures the last card can remain selected even when it can't scroll to center
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;
      if (isAtBottom) {
        const cards = container.querySelectorAll("[data-holiday-id]");
        const lastCard = cards[cards.length - 1];
        const holidayId = lastCard?.getAttribute("data-holiday-id");
        if (holidayId) {
          setActiveHolidayId(holidayId);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip if programmatic scroll is in progress or active holiday is locked
        if (isScrollingProgrammatically || isActiveHolidayLocked) return;

        // PRIORITIZE EDGE CASES: Check top/bottom scroll position first
        // This overrides IntersectionObserver results which might be skewed by the rootMargin

        // Edge case: If scrolled to top, force activate first card
        if (container.scrollTop <= 50) {
          const firstCard = container.querySelector("[data-holiday-id]");
          const holidayId = firstCard?.getAttribute("data-holiday-id");
          if (holidayId) {
            setActiveHolidayId(holidayId);
          }
          return;
        }

        // Edge case: If scrolled to bottom, force activate last card
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;
        if (isAtBottom) {
          const cards = container.querySelectorAll("[data-holiday-id]");
          const lastCard = cards[cards.length - 1];
          const holidayId = lastCard?.getAttribute("data-holiday-id");
          if (holidayId) {
            setActiveHolidayId(holidayId);
          }
          return;
        }

        // Skip if no entries
        if (entries.length === 0) return;

        // Find the entry with the highest intersection ratio
        let mostVisibleEntry = entries[0];
        let maxRatio = entries[0].intersectionRatio;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });

        // Update active holiday if intersection ratio is above threshold
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0) {
          const holidayId = mostVisibleEntry.target.getAttribute(
            "data-holiday-id"
          );
          if (holidayId) {
            setActiveHolidayId(holidayId);
          }
        }
      },
      {
        root: container,
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    // Observe all holiday cards
    const cards = container.querySelectorAll("[data-holiday-id]");
    cards.forEach((card) => observer.observe(card));

    // Add scroll listener to detect top scroll
    container.addEventListener("scroll", checkScrollPosition);

    // Check initial position
    checkScrollPosition();

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, [containerRef, setActiveHolidayId, isScrollingProgrammatically, isActiveHolidayLocked]);
}
