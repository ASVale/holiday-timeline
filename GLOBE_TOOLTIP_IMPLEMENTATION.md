# 3D Globe and Tooltip Implementation - Technical Overview

## Architecture Overview

This Next.js project uses **react-globe.gl** (a React wrapper around three-globe/Three.js) to render an interactive 3D Earth globe with location markers and hover tooltips.

### Component Hierarchy

```
GlobeContainer (src/components/globe/GlobeContainer.tsx)
├─ Globe3D (src/components/globe/Globe3D.tsx)
│  └─ GlobeGL (src/components/globe/Globe3DWrapper.tsx) - dynamic import of react-globe.gl
└─ Tooltip (Framer Motion AnimatePresence)
```

---

## 1. Globe Rendering ([Globe3D.tsx](src/components/globe/Globe3D.tsx))

### Core Library
- **Library**: `react-globe.gl` (v2.27.2) - wraps three-globe and Three.js
- **Loading**: Dynamically imported with `next/dynamic` and `ssr: false` to avoid SSR issues
- **Texture**: Uses `//unpkg.com/three-globe/example/img/earth-night.jpg` for Earth's night texture

### Globe Configuration
```typescript
// From lib/constants.ts
GLOBE_CONFIG = {
  autoRotateSpeed: 0.3,
  markerColor: "#f59e0b",        // amber/orange
  activeMarkerColor: "#fbbf24",   // lighter amber
  markerSize: 1.2,
  activeMarkerSize: 1.6,
  focusAltitude: 0.8,
  animationDuration: 1000
}
```

### Key Props Passed to GlobeGL
- `globeImageUrl`: Earth texture
- `backgroundColor`: transparent (`rgba(0,0,0,0)`)
- `atmosphereColor`: `#f59e0b` (amber)
- `atmosphereAltitude`: `0.15`
- `htmlElementsData`: Array of marker data
- `htmlElement`: Custom function that returns DOM elements for markers
- `onHtmlClick`: Marker click handler
- `onGlobeClick`: Background click handler

---

## 2. Custom Marker Rendering

### Marker Creation ([Globe3D.tsx:98-165](src/components/globe/Globe3D.tsx#L98-L165))

Each marker is a **custom HTML/SVG element** created by the `markerHtmlElement` callback:

```typescript
const markerHtmlElement = (marker: GlobeMarkerData) => {
  const el = document.createElement("div");
  el.style.position = "relative";
  el.style.width = `${size * 20}px`;
  el.style.height = `${size * 20}px`;
  el.style.cursor = "pointer";
  el.style.pointerEvents = "auto";  // CRITICAL for hover detection
  el.style.zIndex = "10";
  el.setAttribute("data-marker-id", marker.id);

  // Store marker data directly on DOM element
  (el as any).__markerData = marker;

  // ... attach event listeners ...
}
```

### Marker Visual Design (SVG)
Each marker consists of:
1. **Outer ring**: 14px radius circle with stroke (60% opacity)
2. **Central dot**: 5px radius filled circle
3. **Active state animation**: Pulsing ring that expands from 14px to 18px radius over 1.5s

```svg
<!-- Outer ring -->
<circle cx="20" cy="20" r="14" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.6" />

<!-- Central dot -->
<circle cx="20" cy="20" r="5" fill="${color}" />

<!-- Pulse animation (active only) -->
<circle cx="20" cy="20" r="14" fill="none" stroke="${color}">
  <animate attributeName="r" from="14" to="18" dur="1.5s" repeatCount="indefinite"/>
  <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
</circle>
```

---

## 3. Hover Detection System

### Event Listener Attachment ([Globe3D.tsx:116-129](src/components/globe/Globe3D.tsx#L116-L129))

**CRITICAL TECHNIQUE**: Event listeners are attached directly to each marker DOM element:

```typescript
const handleMouseEnter = () => {
  if (onMarkerHoverRef.current) {
    onMarkerHoverRef.current(marker);
  }
};

const handleMouseLeave = () => {
  if (onMarkerHoverRef.current) {
    onMarkerHoverRef.current(null);
  }
};

el.addEventListener("mouseenter", handleMouseEnter);
el.addEventListener("mouseleave", handleMouseLeave);
```

### Ref Pattern for Callbacks
Uses `useRef` to store the latest callback version to prevent stale closures:

```typescript
const onMarkerHoverRef = useRef(onMarkerHover);
useEffect(() => {
  onMarkerHoverRef.current = onMarkerHover;
}, [onMarkerHover]);
```

---

## 4. Tooltip Positioning ([GlobeContainer.tsx:53-79](src/components/globe/GlobeContainer.tsx#L53-L79))

### Dynamic Position Calculation

The tooltip follows the marker as the globe rotates using a **continuous position update** system:

```typescript
useEffect(() => {
  if (!hoveredMarker) return;

  const updatePosition = () => {
    // Find marker element by data attribute
    const markerElement = document.querySelector(`[data-marker-id="${hoveredMarker.id}"]`);

    if (markerElement) {
      const rect = markerElement.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;

      setTooltipPosition({
        x: rect.left + rect.width / 2,      // Centered horizontally
        y: rect.top - tooltipHeight - 10    // Above marker with 10px gap
      });
    }
  };

  updatePosition();

  // Update every 50ms to follow globe rotation
  const interval = setInterval(updatePosition, 50);
  return () => clearInterval(interval);
}, [hoveredMarker]);
```

### Key Positioning Features
1. **Initial calculation**: Runs immediately when marker is hovered
2. **Continuous tracking**: Updates every 50ms via `setInterval`
3. **Cleanup**: Clears interval when marker changes or unhovered
4. **Centering**: Uses `transform: translateX(-50%)` for horizontal centering

---

## 5. Tooltip Visual Design ([GlobeContainer.tsx:141-193](src/components/globe/GlobeContainer.tsx#L141-L193))

### Framer Motion Animation
```typescript
<AnimatePresence>
  {hoveredHoliday && tooltipPosition && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 pointer-events-none"  // Fixed positioning
      style={{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        transform: 'translateX(-50%)',
      }}
    >
```

### Tooltip Structure
1. **Container**: 320px width card with border and shadow
2. **Image**: 128px height cover image
3. **Content**: Date range, title, location, description
4. **Pointer arrow**: CSS triangle pointing down to marker
5. **Interaction**: Double-click navigates to detail page

### Pointer Arrow (CSS Triangle)
```tsx
<div
  className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
  style={{
    bottom: '-10px',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '10px solid #f59e0b',  // Amber accent color
  }}
/>
```

---

## 6. State Management

### Marker Data Flow
```typescript
// GlobeContainer creates markers from holidays
const markers: GlobeMarkerData[] = holidays.map(holiday => ({
  id: holiday.id,
  lat: holiday.coordinates.lat,
  lng: holiday.coordinates.lng,
  size: isFiltered ? 0.6 : 1.2,
  color: isFiltered ? "#666666" : "#f59e0b",
  label: holiday.title,
  isActive: holiday.id === activeHolidayId || isHovered
}));
```

### Hover State
```typescript
const [hoveredMarker, setHoveredMarker] = useState<GlobeMarkerData | null>(null);
const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
```

---

## 7. Key Technical Decisions

### Why Custom HTML Markers?
- react-globe.gl supports HTML elements via `htmlElementsData` + `htmlElement` callback
- Allows full control over styling, animations, and event handling
- Direct DOM access for precise tooltip positioning

### Why `pointer-events: auto` on Markers?
- Ensures markers receive mouse events even when over the Three.js canvas
- Without this, hover detection fails

### Why `pointer-events: none` on Tooltip Container?
- Prevents tooltip from blocking mouse interaction with globe
- Inner card has `pointer-events: auto` for double-click functionality

### Why 50ms Position Updates?
- Balances smoothness vs performance
- Globe rotation is smooth at this update rate
- Lower values (e.g., 16ms) would be smoother but more expensive

---

## Type Definitions ([types.ts](src/components/globe/types.ts))

```typescript
export interface GlobeMarkerData {
  id: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  isActive?: boolean;
}

export interface GlobeAdapterProps {
  markers: GlobeMarkerData[];
  focusPoint?: GeoPoint | null;
  onMarkerClick?: (id: string) => void;
  onMarkerHover?: (marker: GlobeMarkerData | null) => void;
  onGlobeClick?: () => void;
  className?: string;
}
```

---

## Dependencies

- **react-globe.gl**: ^2.27.2 - Main globe library
- **three**: ^0.171.0 - 3D rendering engine (peer dependency)
- **framer-motion**: ^11.18.0 - Tooltip animations
- **next**: ^15.1.6 - Framework (for dynamic imports)

---

## Summary for Future Agents

This implementation demonstrates:
1. **Custom HTML markers** on a Three.js globe with direct DOM manipulation
2. **Event-driven hover system** using native `mouseenter`/`mouseleave`
3. **Dynamic tooltip positioning** with continuous tracking via `setInterval`
4. **Framer Motion animations** for smooth enter/exit transitions
5. **CSS triangles** for visual pointer arrows
6. **Ref pattern** to avoid stale closure issues in event handlers

The key insight is that markers are regular DOM elements rendered by react-globe.gl, allowing standard web techniques (event listeners, `getBoundingClientRect()`, etc.) to work seamlessly with the 3D globe.

---

## File Locations

- Main globe component: [src/components/globe/Globe3D.tsx](src/components/globe/Globe3D.tsx)
- Container with tooltip: [src/components/globe/GlobeContainer.tsx](src/components/globe/GlobeContainer.tsx)
- Type definitions: [src/components/globe/types.ts](src/components/globe/types.ts)
- Configuration: [src/lib/constants.ts](src/lib/constants.ts)
