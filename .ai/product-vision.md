# Product Vision

> North star vision for the Interactive World Timeline Portfolio project. Maintained by the Product Strategist agent.

## North Star

**One-liner**: An immersive personal portfolio that visualizes holidays and travels across time and space using a 3D interactive globe.

**Vision**: A stunning, award-worthy personal website that makes browsing travel experiences feel like exploring the world itself — seamless transitions between globe and timeline views, rich media, and delightful micro-interactions that make visitors want to explore every destination.

**Core Value Proposition**: Unlike static portfolio sites, this creates an interactive, spatial experience where visitors can discover stories through an engaging 3D globe or a chronological timeline, making the content memorable and shareable.

## User Personas

### Primary Persona — "Curious Visitor"
- **Who**: Friends, family, colleagues, or strangers who land on the site
- **Goals**: Explore travel stories, see where the site owner has been, get inspired
- **Pain Points**: Static travel blogs feel repetitive; photo dumps lack narrative
- **How We Help**: The globe creates an immediate "wow" factor, and the timeline gives structure to the stories

### Secondary Persona — "Potential Employer / Collaborator"
- **Who**: Recruiters, hiring managers, potential collaborators
- **Goals**: Evaluate technical skill and creativity
- **Pain Points**: Standard developer portfolios are indistinguishable
- **How We Help**: The site itself IS the portfolio piece — demonstrating 3D web, React, performance optimization, and UX thinking

## Roadmap

### ✅ Completed
- Interactive 3D globe with custom markers
- Timeline view with holiday cards
- Dual view modes (Globe/Timeline)
- Hover tooltips on globe markers
- Click markers to navigate to detail view
- Scroll-spy navigation in timeline
- Modal overlays via parallel routing
- Filter by year/location/category
- Auto-rotating globe with camera transitions
- Unit testing with Vitest + RTL
- Globe cursor flickering fix
- Node click navigation
- Tooltip close-on-new-open behavior

### 🚧 In Progress
- Holiday detail pages with rich content (photos, descriptions, highlights)

### 📋 Planned (Next)
- Photo galleries with lightbox
- Photo galleries with lightbox
- About/Bio section
- Performance optimization pass

### 💭 Future Ideas
- Search functionality
- Map view (2D Mercator projection as alternative)
- Travel statistics dashboard (countries visited, total distance, etc.)
- Social sharing for individual holidays
- Dark/light theme toggle
- Loading animations and skeleton states
- PWA support for offline access
- Blog/writing section
- Multi-language support

## Key Product Decisions

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2026-02 | Dark-only theme | Complements the globe visualization (night Earth texture) | Light theme option |
| 2026-02 | react-globe.gl over D3/Mapbox | Provides out-of-box 3D globe with Three.js; less custom code | D3.js globe, Mapbox GL |
| 2026-02 | Next.js App Router | Latest routing paradigm with parallel routes for modals | Pages Router |
| 2026-02 | Zustand over Redux | Lightweight, minimal boilerplate for simple state needs | Redux Toolkit, Jotai |
