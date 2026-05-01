# Ammu — Streaming Platform Knowledge Base

## Project Overview
A premium, dark-themed video streaming platform that combines TMDB data with vidsrc-embed playback. Users search/browse content on our site and watch directly here — no redirects.

## Tech Stack
- **Frontend**: React 19 + TypeScript, Vite 8
- **Routing**: react-router-dom
- **Animations**: framer-motion (installed, ready for use)
- **Styling**: Vanilla CSS with custom properties, glassmorphism, ambient orb animations
- **APIs**: TMDB v3 (data) + 2Embed.cc (playback)
- **Infrastructure**: AWS CDK (planned, not yet configured)

## Architecture
```
src/
├── types/tmdb.ts          — All TypeScript interfaces for TMDB responses
├── services/
│   ├── tmdb.ts            — TMDB API client (trending, popular, search, details, discover, genres)
│   └── vidsrc.ts          — vidsrc embed URL builder (movies + TV episodes)
├── components/
│   ├── Navbar.tsx          — Glassmorphism sticky navbar with search
│   ├── HeroBanner.tsx      — Auto-rotating hero with trending content
│   ├── ContentCard.tsx     — Poster card with hover effects + rating
│   └── ContentRow.tsx      — Horizontal scroll row of cards
├── pages/
│   ├── HomePage.tsx        — Hero + 5 content rows (popular, top rated, etc.)
│   ├── SearchPage.tsx      — Multi-search with filter chips + load more
│   ├── BrowsePage.tsx      — Discover with genre filters + sort dropdown
│   ├── MovieDetailPage.tsx — Full movie info, cast, trailer, recommendations
│   ├── TVDetailPage.tsx    — TV info, season/episode selector, cast
│   └── WatchPage.tsx       — Fullscreen vidsrc iframe player
└── index.css               — Complete design system
```

## API Integration

### TMDB Endpoints Used
| Endpoint | Purpose |
|---|---|
| `/trending/{type}/{window}` | Hero banner |
| `/movie/popular`, `/tv/popular` | Popular rows |
| `/movie/top_rated` | Top rated row |
| `/movie/now_playing` | Now playing row |
| `/movie/upcoming` | Coming soon row |
| `/search/multi` | Global search |
| `/discover/movie`, `/discover/tv` | Browse with filters |
| `/movie/{id}` + append_to_response | Movie detail (videos, credits, recs, similar) |
| `/tv/{id}` + append_to_response | TV detail |
| `/tv/{id}/season/{n}` | Episode list |
| `/genre/movie/list`, `/genre/tv/list` | Genre filters |

### 2Embed.cc Integration (Primary Source)
We use 2Embed.cc as our exclusive provider because it includes multiple internal servers (Xps, Vkng, Vsrc, etc.) accessible within the player UI.

- **Movie Embed**: `https://www.2embed.cc/embed/{tmdb_id}`
- **TV Series Embed**: `https://www.2embed.cc/embedtv/{tmdb_id}&s={season}&e={episode}`
- **Full Season Embed**: `https://www.2embed.cc/embedtvfull/{tmdb_id}`

## Design System
- **Theme**: Dark futuristic with ambient floating orbs
- **Colors**: Purple accent (#7c3aed), Cyan secondary (#06b6d4), Pink (#ec4899)
- **Glass**: Backdrop-filter blur with subtle borders
- **Font**: Inter (Google Fonts)
- **Animations**: Orb float, card hover scale, hero auto-rotate

## Playback Challenges & Attempted Fixes

### 1. Ad Blocking & Popups
- **The Issue**: Clicking anywhere on the embedded player often opens background tabs with ads.
- **Attempted**: Using the HTML `sandbox` attribute (omitting `allow-popups`).
- **Result**: **FAILED**. Blocking popups via sandbox causes the vidsrc player to throw a "Media Not Available" error. The player likely checks for popup/storage permissions as a form of anti-adblock.
- **Recommendation**: Best handled at the browser level (Brave Browser or uBlock Origin extension).

### 2. Fullscreen Inconsistency
- **The Issue**: The built-in fullscreen button in the vidsrc player often fails to trigger.
- **Attempted**: 
  - Added legacy attributes: `webkitallowfullscreen`, `mozallowfullscreen`.
  - Added `allow="fullscreen"` policy.
- **Result**: **PARTIAL SUCCESS**. Works on some mirrors/browsers, but still fails on others due to Cross-Origin security policies.
- **Solution**: Use "Pseudo-fullscreen" (scaling the iframe container to fixed 100vw/100vh) to bypass iframe restrictions.

### 3. Custom 10s Skip / Playback Controls
- **The Issue**: User wants 10s forward/backward buttons in our UI.
- **The Reality**: **IMPOSSIBLE** via standard JS. Because the player is an `<iframe>` from a different domain, browser security (CORS) prevents our code from accessing the inner `<video>` element. 
- **Exception**: Only possible if the provider exposes a `postMessage` API (Research shows vidsrc does **not** provide this).

### 4. Player Customization (Colors)
- **Feature**: `?colour=XXXXXX` or `?color=XXXXXX` query parameter.
- **Status**: Mirror-dependent. Use 6-digit hex without the `#`.

## Research Findings (2026-04-30)
- **Pseudo-Fullscreen**: Scaling our own container to fill the window is the only reliable way to "fullscreen" a cross-origin iframe when its native button is blocked.
- **Color Param**: Verified as a query parameter `?colour=7c3aed`.
- **postMessage**: Confirmed no official API exists for vidsrc playback control.

## Pending Tasks & Bugs
- [ ] **Fix Fullscreen**: Implement "Pseudo-Fullscreen" container logic.
- [ ] **Ad Mitigation**: Test if `vidsrc.to` or `vidsrc.xyz` mirrors have fewer ads.
- [ ] **Watch History**: Add local-storage based "Continue Watching" feature.
- [ ] **Search Refinement**: Ensure the search dropdown closes on every navigation event.

## Development Log
- **[2026-04-29]**: Project initialized. Full TMDB integration + vidsrc playback built.
- **[2026-04-30]**: 
  - Attempted custom 10s skip and native fullscreen fixes (Blocked by CORS).
  - Attempted ad-blocking via `sandbox` (Blocked by player security check).
  - Researched and documented "Pseudo-Fullscreen" and `?colour` parameters.
  - Fixed Navbar search debounce memory leak.
  - Improved Watch page to support IMDB IDs.
