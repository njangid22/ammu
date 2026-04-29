# Ammu — Streaming Platform Knowledge Base

## Project Overview
A premium, dark-themed video streaming platform that combines TMDB data with vidsrc-embed playback. Users search/browse content on our site and watch directly here — no redirects.

## Tech Stack
- **Frontend**: React 19 + TypeScript, Vite 8
- **Routing**: react-router-dom
- **Animations**: framer-motion (installed, ready for use)
- **Styling**: Vanilla CSS with custom properties, glassmorphism, ambient orb animations
- **APIs**: TMDB v3 (data) + vidsrc-embed.ru (playback)
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

### vidsrc Embed
- Movie: `https://vidsrc-embed.ru/embed/movie?tmdb={id}`
- TV Episode: `https://vidsrc-embed.ru/embed/tv?tmdb={id}&season={s}&episode={e}`

## Design System
- **Theme**: Dark futuristic with ambient floating orbs
- **Colors**: Purple accent (#7c3aed), Cyan secondary (#06b6d4), Pink (#ec4899)
- **Glass**: Backdrop-filter blur with subtle borders
- **Font**: Inter (Google Fonts)
- **Animations**: Orb float, card hover scale, hero auto-rotate

## Development Log
- **[2026-04-29]**: Project initialized. Full TMDB integration + vidsrc playback built. All pages complete: Home, Search, Browse, Movie Detail, TV Detail, Watch.
