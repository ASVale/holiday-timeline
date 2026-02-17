"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { GlobeAdapterProps, GlobeMarkerData } from "./types";
import { GLOBE_CONFIG } from "@/lib/constants";

const GlobeGL = dynamic(() => import("./Globe3DWrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Loading globe...</div>
    </div>
  ),
});

export default function Globe3D({
  markers,
  activeHolidayId,
  focusPoint,
  onMarkerClick,
  onMarkerHover,
  onGlobeClick,
  className = "",
}: GlobeAdapterProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Store the hover callback in a ref so event listeners always use the latest version
  const onMarkerHoverRef = useRef(onMarkerHover);
  useEffect(() => {
    onMarkerHoverRef.current = onMarkerHover;
  }, [onMarkerHover]);

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (globeRef.current && isReady) {
      // Configure globe controls
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = GLOBE_CONFIG.autoRotateSpeed;
        controls.enableZoom = true;
        controls.minDistance = 200;
        controls.maxDistance = 600;
      }
    }
  }, [isReady]);

  useEffect(() => {
    if (globeRef.current && isReady) {
      const controls = globeRef.current.controls();
      if (controls) {
        // Disable auto-rotate when there's a focus point (holiday is active)
        controls.autoRotate = !focusPoint;
      }

      if (focusPoint) {
        globeRef.current.pointOfView(
          {
            lat: focusPoint.lat,
            lng: focusPoint.lng,
            altitude: GLOBE_CONFIG.focusAltitude,
          },
          GLOBE_CONFIG.animationDuration
        );
      }
    }
  }, [focusPoint, isReady]);

  // Handle active marker status via direct DOM manipulation to prevent re-render flickers
  useEffect(() => {
    if (!isReady) return;

    const allMarkers = containerRef.current?.querySelectorAll("[data-marker-id]");
    allMarkers?.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const markerId = htmlEl.getAttribute("data-marker-id");
      const isActive = markerId === activeHolidayId;

      // Get the pulse element
      const pulse = htmlEl.querySelector(".marker-pulse") as HTMLElement;
      if (pulse) {
        pulse.style.display = isActive ? "block" : "none";
      }

      // Update size and color if needed
      // Note: Full SVG replacement or targeted attribute updates
      // For now, simple pulse toggle is most important for flicker fix
    });
  }, [activeHolidayId, isReady]);

  // Wrapper for marker click to ensure latest callback is used
  const handleMarkerClick = useCallback(
    (marker: any) => {
      if (onMarkerClick && marker?.id) {
        onMarkerClick(marker.id);
      }
    },
    [onMarkerClick]
  );

  // Custom marker rendering - stable version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerHtmlElement = useCallback((d: any) => {
    const marker = d as GlobeMarkerData;
    // Initial state (will be updated by effect)
    const size = GLOBE_CONFIG.markerSize;
    const color = GLOBE_CONFIG.markerColor;

    const el = document.createElement("div");
    el.style.position = "relative";
    el.style.width = `${size * 20}px`;
    el.style.height = `${size * 20}px`;
    el.style.cursor = "pointer";
    el.style.pointerEvents = "auto";
    el.style.zIndex = "10";
    el.setAttribute("data-marker-id", marker.id);

    // Add hover events using the ref
    const handleMouseEnter = () => {
      el.style.transform = "scale(1.2)";
      el.style.zIndex = "20";
      // Show pulse on hover
      const pulse = el.querySelector(".marker-pulse") as HTMLElement;
      if (pulse) pulse.style.display = "block";

      if (onMarkerHoverRef.current) {
        onMarkerHoverRef.current(marker);
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = "scale(1)";
      el.style.zIndex = "10";
      // Hide pulse after hover if not active
      const markerId = el.getAttribute("data-marker-id");
      if (markerId !== activeHolidayId) {
        const pulse = el.querySelector(".marker-pulse") as HTMLElement;
        if (pulse) pulse.style.display = "none";
      }

      if (onMarkerHoverRef.current) {
        onMarkerHoverRef.current(null);
      }
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onMarkerClick) {
        onMarkerClick(marker.id);
      }
    });

    el.innerHTML = `
      <svg width="${size * 20}" height="${size * 20}" viewBox="0 0 40 40" style="pointer-events: none;">
        <!-- Outer ring -->
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="transparent"
          stroke="${color}"
          stroke-width="1.5"
          opacity="0.6"
        />
        <!-- Central dot -->
        <circle
          cx="20"
          cy="20"
          r="5"
          fill="${color}"
        />
        <!-- Pulse animation (toggled by effect) -->
        <circle 
          class="marker-pulse"
          cx="20" 
          cy="20" 
          r="14" 
          fill="none" 
          stroke="${color}" 
          stroke-width="2" 
          opacity="0.4"
          style="display: none;"
        >
          <animate attributeName="r" from="14" to="18" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `;

    return el;
  }, [onMarkerClick, activeHolidayId]); // We still need activeHolidayId to know the state on initial mount
  // Include onMarkerClick dependency

  return (
    <div ref={containerRef} className={className}>
      <GlobeGL
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#f59e0b"
        atmosphereAltitude={0.15}
        htmlElementsData={markers}
        htmlLat="lat"
        htmlLng="lng"
        htmlElement={markerHtmlElement}
        htmlAltitude={0.01}
        htmlTransitionDuration={300}
        onHtmlClick={handleMarkerClick}
        onGlobeClick={onGlobeClick}
        onGlobeReady={() => setIsReady(true)}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
