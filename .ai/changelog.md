# Changelog

> All notable changes to this project are documented here. Maintained by the AI agent framework. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [2026-02-17]
### Added
- AI agent framework initialized (`.ai/` knowledge base)
- Unit testing setup with Vitest + React Testing Library + happy-dom
- Node click navigation on globe
- Tooltip close-on-new-open behavior for timeline cards

### Fixed
- Globe cursor flickering between pointer and hand on node hover

### Changed
- Combined dual circle globe nodes into single elements for better hover detection

## [2026-02-11]
### Added
- Initial project setup
- Interactive 3D globe with react-globe.gl
- Timeline view with holiday cards
- Dual view modes (Globe/Timeline)
- Hover tooltips on globe markers
- Auto-rotating globe with camera transitions
- Scroll-spy navigation in timeline
- Modal overlays via Next.js parallel routing
- Filter bar (year, location, category)
- Zustand state management
