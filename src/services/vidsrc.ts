// ─── Embed Provider Service (2Embed Only) ─────────────────────────────────────
const TWOEMBED_BASE = import.meta.env.VITE_2EMBED_BASE_URL;

/**
 * Generates the 2Embed movie player URL.
 * Reverted default player parameter as it was unconfirmed.
 */
export function getMovieEmbedUrl(id: string | number): string {
  return `${TWOEMBED_BASE}/embed/${id}`;
}

/**
 * Generates the 2Embed TV show episode player URL.
 * Format: {base}/embedtv/{id}&s={season}&e={episode}
 */
export function getTVEmbedUrl(id: string | number, season: number, episode: number): string {
  return `${TWOEMBED_BASE}/embedtv/${id}&s=${season}&e=${episode}`;
}
