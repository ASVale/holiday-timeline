# Design System

> Extracted from the current project's Tailwind config and component patterns. The Design Lead agent maintains this file.

## Color Palette

### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0a0a0f` | Page background (near-black) |
| `surface` | `#1a1a24` | Card/panel backgrounds (dark gray-blue) |
| `accent` | `#f59e0b` | Primary accent — markers, highlights, CTAs (amber) |
| `accent-hover` | `#fbbf24` | Hover state for accent elements (lighter amber) |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `gray-100` | Primary body text |
| `text-muted` | `gray-400` | Secondary/placeholder text |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| — | To be defined | Success, warning, error, info states |

## Typography

| Element | Font | Details |
|---------|------|---------|
| Body | System default (Tailwind) | `text-gray-100` on dark background |
| Headings | System default | Various weights, specific sizes per component |

**Note**: No custom fonts configured yet. Consider adding a modern variable font (e.g., Inter, Geist, or Outfit) for a more premium feel.

## Theme

- **Mode**: Dark only — the design is built around a dark background to complement the globe visualization
- **Approach**: Tailwind CSS utility classes, custom colors in `tailwind.config.ts`
- **Scrollbars**: Hidden globally across all browsers

## Globe-Specific Design Tokens

Defined in `src/lib/constants.ts`:
| Token | Value | Usage |
|-------|-------|-------|
| `autoRotateSpeed` | `0.3` | Globe auto-rotation speed |
| `markerColor` | `#f59e0b` | Default marker color |
| `activeMarkerColor` | `#fbbf24` | Active/hovered marker color |
| `markerSize` | `1.2` | Default marker size |
| `activeMarkerSize` | `1.6` | Active/hovered marker size |
| `focusAltitude` | `0.8` | Camera zoom level when focusing on marker |
| `animationDuration` | `1000` | Transition animation duration (ms) |

## Component Patterns

### Cards (HolidayCard)
- Dark surface background with subtle border
- Hover state with accent color highlight
- Includes image, date, title, location
- Smooth transitions on state changes

### Modal
- Overlay with backdrop blur
- Centered content panel
- Keyboard accessible (Escape to close)

### Globe Tooltips
- Positioned dynamically relative to globe markers
- Follow markers during rotation
- Click to navigate to detail view

### Navigation
- Top navigation bar with view toggle (Globe/Timeline)
- Filter bar for year/location/category filtering
