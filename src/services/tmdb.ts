// ─── TMDB API Service ────────────────────────────────────────────────────────
import type {
  Movie,
  MovieDetails,
  TVShow,
  TVDetails,
  SeasonDetails,
  Cast,
  Crew,
  Video,
  Genre,
  SearchResult,
  PaginatedResponse,
} from '../types/tmdb';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '';
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null): string {
  return getImageUrl(path, 'original');
}

// ─── Trending ────────────────────────────────────────────────────────────────

export function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'day'
) {
  return tmdbFetch<PaginatedResponse<Movie & TVShow>>(`/trending/${mediaType}/${timeWindow}`);
}

// ─── Movies ──────────────────────────────────────────────────────────────────

export function getPopularMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/popular', { page: String(page) });
}

export function getTopRatedMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/top_rated', { page: String(page) });
}

export function getUpcomingMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/upcoming', { page: String(page) });
}

export function getNowPlayingMovies(page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/now_playing', { page: String(page) });
}

export function getMovieDetails(id: number) {
  return tmdbFetch<MovieDetails>(`/movie/${id}`, { append_to_response: 'videos,credits,recommendations,similar' });
}

export function getMovieCredits(id: number) {
  return tmdbFetch<{ cast: Cast[]; crew: Crew[] }>(`/movie/${id}/credits`);
}

export function getMovieVideos(id: number) {
  return tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`);
}

export function getMovieRecommendations(id: number, page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/recommendations`, { page: String(page) });
}

export function getSimilarMovies(id: number, page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/similar`, { page: String(page) });
}

// ─── TV Shows ────────────────────────────────────────────────────────────────

export function getPopularTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/popular', { page: String(page) });
}

export function getTopRatedTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/top_rated', { page: String(page) });
}

export function getOnTheAirTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/on_the_air', { page: String(page) });
}

export function getAiringTodayTV(page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/airing_today', { page: String(page) });
}

export function getTVDetails(id: number) {
  return tmdbFetch<TVDetails>(`/tv/${id}`, { append_to_response: 'videos,credits,recommendations,similar' });
}

export function getTVCredits(id: number) {
  return tmdbFetch<{ cast: Cast[]; crew: Crew[] }>(`/tv/${id}/credits`);
}

export function getTVSeasonDetails(tvId: number, seasonNumber: number) {
  return tmdbFetch<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function searchMulti(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<SearchResult>>('/search/multi', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}

export function searchMovies(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/search/movie', {
    query,
    page: String(page),
  });
}

export function searchTV(query: string, page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/search/tv', {
    query,
    page: String(page),
  });
}

// ─── Discover ────────────────────────────────────────────────────────────────

export function discoverMovies(filters: Record<string, string> = {}, page = 1) {
  return tmdbFetch<PaginatedResponse<Movie>>('/discover/movie', {
    page: String(page),
    sort_by: 'popularity.desc',
    ...filters,
  });
}

export function discoverTV(filters: Record<string, string> = {}, page = 1) {
  return tmdbFetch<PaginatedResponse<TVShow>>('/discover/tv', {
    page: String(page),
    sort_by: 'popularity.desc',
    ...filters,
  });
}

// ─── Genres ──────────────────────────────────────────────────────────────────

export function getMovieGenres() {
  return tmdbFetch<{ genres: Genre[] }>('/genre/movie/list');
}

export function getTVGenres() {
  return tmdbFetch<{ genres: Genre[] }>('/genre/tv/list');
}
