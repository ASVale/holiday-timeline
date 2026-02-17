# Project Context

> This file is maintained by the AI agent framework. It serves as the single source of truth for project conventions and architecture. Both Claude and Gemini reference this file.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 3.4.x |
| Animation | Framer Motion | 11.x |
| 3D Visualization | react-globe.gl + Three.js | 2.27.x / 0.171.x |
| State Management | Zustand | 5.x |
| Date Utilities | date-fns | 4.x |
| CSS Utilities | clsx | 2.x |
| Testing | Vitest + React Testing Library + happy-dom | 4.x / 16.x / 20.x |
| Package Manager | npm | — |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (site)/                   # Site layout group
│   │   ├── holidays/             # Holidays list page
│   │   │   └── @modal/           # Parallel route for modals
│   │   └── holiday/[slug]/       # Holiday detail page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to /holidays)
│
├── components/
│   ├── globe/                    # 3D globe components (Globe3D, GlobeContainer, etc.)
│   ├── timeline/                 # Timeline components (Timeline, HolidayCard, etc.)
│   ├── holiday-detail/           # Holiday detail components
│   ├── layout/                   # SiteNav, FilterBar, ViewToggle
│   └── ui/                       # Modal and reusable UI components
│
├── data/                         # Data types and holiday data
├── hooks/                        # useFilteredHolidays, useGlobeSync, useScrollSpy
├── lib/                          # data.ts, constants.ts
├── store/                        # useHolidayStore (Zustand)
├── test/                         # Test setup
└── types/                        # TypeScript declarations
```

## Conventions

### Naming
- Components: `PascalCase` (e.g., `Globe3D.tsx`, `HolidayCard.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useScrollSpy.ts`)
- Utilities & data: `camelCase` (e.g., `constants.ts`, `holidays.ts`)
- Styles: Tailwind CSS utility classes
- Tests: `__tests__/ComponentName.test.tsx` co-located within component directories

### Code Style
- Functional components with hooks exclusively (no class components)
- Dynamic imports for heavy components (Three.js/globe) to avoid SSR issues
- Zustand for global state, React hooks for local state
- Parallel routes for modal overlays (Next.js App Router)

### Architecture Decisions
- **Globe rendering**: Dynamic import with `ssr: false` to prevent Three.js server errors
- **Tooltip positioning**: Continuous position updates via intervals to track globe rotation
- **View modes**: Globe and Timeline views with state-managed toggle
- **Custom HTML markers**: DOM-based markers on globe for precise hover/click control

## Dev Commands

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run Vitest
npm run test:ui      # Run Vitest with UI
npm run test:coverage # Generate test coverage report
```
