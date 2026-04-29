import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from '../services/tmdb';
import type { MediaItem, Movie, TVShow } from '../types/tmdb';

export default function HomePage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);

  useEffect(() => {
    getTrending('all', 'day').then((r) => setTrending(r.results.slice(0, 10)));
    getPopularMovies().then((r) => setPopular(r.results));
    getPopularTV().then((r) => setPopularTV(r.results));
    getTopRatedMovies().then((r) => setTopRated(r.results));
    getUpcomingMovies().then((r) => setUpcoming(r.results));
    getNowPlayingMovies().then((r) => setNowPlaying(r.results));
  }, []);

  return (
    <>
      <HeroBanner items={trending} />
      <ContentRow title="🔥 Popular Movies" items={popular} defaultMediaType="movie" />
      <ContentRow title="📺 Popular TV Shows" items={popularTV} defaultMediaType="tv" />
      <ContentRow title="⭐ Top Rated" items={topRated} defaultMediaType="movie" />
      <ContentRow title="🎬 Now Playing" items={nowPlaying} defaultMediaType="movie" />
      <ContentRow title="🔮 Coming Soon" items={upcoming} defaultMediaType="movie" />
    </>
  );
}
