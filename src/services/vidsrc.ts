// ─── VidSrc Embed Service ────────────────────────────────────────────────────

const VIDSRC_BASE = import.meta.env.VITE_VIDSRC_BASE_URL || 'https://vidsrc-embed.ru/embed';

interface EmbedOptions {
  ds_lang?: string;
  sub_url?: string;
  autoplay?: 0 | 1;
  autonext?: 0 | 1;
}

export function getMovieEmbedUrl(tmdbId: number, options: EmbedOptions = {}): string {
  const url = new URL(`${VIDSRC_BASE}/movie`);
  url.searchParams.set('tmdb', String(tmdbId));
  applyOptions(url, options);
  return url.toString();
}

export function getTVEmbedUrl(
  tmdbId: number,
  season?: number,
  episode?: number,
  options: EmbedOptions = {}
): string {
  const url = new URL(`${VIDSRC_BASE}/tv`);
  url.searchParams.set('tmdb', String(tmdbId));
  if (season !== undefined) url.searchParams.set('season', String(season));
  if (episode !== undefined) url.searchParams.set('episode', String(episode));
  applyOptions(url, options);
  return url.toString();
}

function applyOptions(url: URL, options: EmbedOptions) {
  if (options.ds_lang) url.searchParams.set('ds_lang', options.ds_lang);
  if (options.sub_url) url.searchParams.set('sub_url', options.sub_url);
  if (options.autoplay !== undefined) url.searchParams.set('autoplay', String(options.autoplay));
  if (options.autonext !== undefined) url.searchParams.set('autonext', String(options.autonext));
}
