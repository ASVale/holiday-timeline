# Interactive World Timeline Portfolio

An immersive personal portfolio website featuring an interactive 3D globe that visualizes holidays and travels across time and space. Built with Next.js 15, React 19, and Three.js.

## Features

### 🌍 Interactive 3D Globe
- Real-time 3D Earth visualization with custom HTML markers
- Hover tooltips that track marker positions as the globe rotates
- Auto-rotating globe with smooth camera transitions
- Click markers to view detailed holiday information
- Night-time Earth texture with atmospheric glow effects

### 📅 Timeline View
- Chronological timeline of holidays and travels
- Interactive cards with images, dates, and locations
- Smooth scroll-spy navigation
- Filter by year, location, or activity type

### 🎨 Modern UI/UX
- Dual view modes: Globe and Timeline
- Parallel routing with modal overlays for seamless navigation
- Framer Motion animations for smooth transitions
- Responsive design with Tailwind CSS
- Dark theme optimized for the globe visualization

### ⚡ Performance
- Dynamic imports for Three.js components (no SSR)
- Optimized re-renders with Zustand state management
- Efficient marker updates and tooltip positioning
- Image optimization with Next.js Image component

## Tech Stack

### Core Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### 3D Visualization
- **[react-globe.gl](https://github.com/vasturiano/react-globe.gl)** - 3D globe component
- **[Three.js](https://threejs.org/)** - 3D rendering engine

### Styling & Animation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[PostCSS](https://postcss.org/)** - CSS processing

### State & Utils
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classnames

### Testing
- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[Testing Library](https://testing-library.com/)** - React component testing
- **[happy-dom](https://github.com/capricorn86/happy-dom)** - DOM simulation

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd personal-website

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate test coverage report
npm run test:coverage
```

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (site)/                  # Site layout group
│   │   ├── holidays/            # Holidays list page
│   │   │   └── @modal/          # Parallel route for modals
│   │   └── holiday/[slug]/      # Holiday detail page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (redirects to /holidays)
│
├── components/
│   ├── globe/                   # 3D globe components
│   │   ├── Globe3D.tsx          # Main 3D globe (react-globe.gl)
│   │   ├── Globe3DWrapper.tsx   # Dynamic import wrapper
│   │   ├── GlobeContainer.tsx   # Container with tooltip logic
│   │   ├── GlobeView.tsx        # View switcher
│   │   ├── BackToTimeline.tsx   # Navigation component
│   │   └── types.ts             # Globe type definitions
│   │
│   ├── timeline/                # Timeline components
│   │   ├── Timeline.tsx         # Main timeline container
│   │   ├── HolidayCard.tsx      # Individual holiday cards
│   │   └── TimelineConnector.tsx # Visual connectors
│   │
│   ├── holiday-detail/          # Holiday detail components
│   │   ├── HolidayContent.tsx   # Detail page content
│   │   └── PhotoGallery.tsx     # Image gallery
│   │
│   ├── layout/                  # Layout components
│   │   ├── SiteNav.tsx          # Navigation bar
│   │   ├── FilterBar.tsx        # Filter controls
│   │   └── ViewToggle.tsx       # Globe/Timeline toggle
│   │
│   └── ui/                      # Reusable UI components
│       └── Modal.tsx            # Modal component
│
├── data/
│   ├── types.ts                 # Data type definitions
│   └── holidays.ts              # Holiday data
│
├── hooks/                       # Custom React hooks
│   ├── useFilteredHolidays.ts   # Filter logic
│   ├── useGlobeSync.ts          # Globe state synchronization
│   └── useScrollSpy.ts          # Scroll position tracking
│
├── lib/
│   ├── data.ts                  # Data utilities
│   └── constants.ts             # App constants & config
│
├── store/
│   └── useHolidayStore.ts       # Zustand store
│
├── test/
│   └── setup.ts                 # Test environment setup
│
└── types/                       # TypeScript declarations
    └── react-globe.gl.d.ts
```

## Key Implementation Details

### 3D Globe with Custom Markers

The globe uses **react-globe.gl** with custom HTML markers for precise control over styling and interactions:

```typescript
// Each marker is a DOM element with event listeners
const markerHtmlElement = (marker: GlobeMarkerData) => {
  const el = document.createElement("div");
  el.style.pointerEvents = "auto"; // Enable hover detection
  el.addEventListener("mouseenter", handleMouseEnter);
  el.addEventListener("mouseleave", handleMouseLeave);
  return el;
};
```

### Dynamic Tooltip Positioning

Tooltips follow markers as the globe rotates using continuous position updates:

```typescript
// Update tooltip position every 50ms to track globe rotation
useEffect(() => {
  if (!hoveredMarker) return;

  const updatePosition = () => {
    const markerElement = document.querySelector(`[data-marker-id="${hoveredMarker.id}"]`);
    if (markerElement) {
      const rect = markerElement.getBoundingClientRect();
      setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    }
  };

  const interval = setInterval(updatePosition, 50);
  return () => clearInterval(interval);
}, [hoveredMarker]);
```

### Modal Routing with Parallel Routes

Uses Next.js 15 parallel routes for modal overlays:

```
app/(site)/holidays/
├── page.tsx              # List view
├── @modal/
│   ├── default.tsx       # Default slot
│   └── (.)holiday/[slug]/page.tsx  # Intercepted route (modal)
└── layout.tsx            # Renders both slots
```

For more technical details, see [GLOBE_TOOLTIP_IMPLEMENTATION.md](./GLOBE_TOOLTIP_IMPLEMENTATION.md).

## Configuration

### Globe Settings

Customize globe appearance in `src/lib/constants.ts`:

```typescript
export const GLOBE_CONFIG = {
  autoRotateSpeed: 0.3,
  markerColor: "#f59e0b",
  activeMarkerColor: "#fbbf24",
  markerSize: 1.2,
  activeMarkerSize: 1.6,
  focusAltitude: 0.8,
  animationDuration: 1000
};
```

### Adding New Holidays

Add holiday data to `src/data/holidays.ts`:

```typescript
{
  id: "unique-id",
  title: "Holiday Name",
  location: "City, Country",
  coordinates: { lat: 0.0, lng: 0.0 },
  startDate: "2024-01-01",
  endDate: "2024-01-07",
  description: "Description of the holiday...",
  category: "beach" | "city" | "mountain" | "culture",
  imageUrl: "/images/holiday.jpg"
}
```

## Testing

Tests are located in `src/components/**/__tests__/`:

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# UI mode for debugging
npm run test:ui
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

Alternatively, deploy to any platform that supports Next.js (Netlify, AWS, etc.).

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires WebGL support for 3D globe

## License

[Your License Here]

## Acknowledgments

- Globe visualization powered by [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- Earth texture from [three-globe examples](https://github.com/vasturiano/three-globe)
- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)
