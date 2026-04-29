import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentCard from '../components/ContentCard';
import {
  discoverMovies,
  discoverTV,
  getMovieGenres,
  getTVGenres,
} from '../services/tmdb';
import type { Genre, Movie, TVShow } from '../types/tmdb';

export default function BrowsePage() {
  const { type } = useParams<{ type: 'movie' | 'tv' }>();
  const mediaType = type === 'tv' ? 'tv' : 'movie';

  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load genres
  useEffect(() => {
    const fn = mediaType === 'tv' ? getTVGenres : getMovieGenres;
    fn().then((r) => setGenres(r.genres));
  }, [mediaType]);

  // Load content
  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType, selectedGenre, sortBy]);

  const fetchPage = (p: number) => {
    setLoading(true);
    const filters: Record<string, string> = { sort_by: sortBy };
    if (selectedGenre) filters.with_genres = String(selectedGenre);

    const fn = mediaType === 'tv' ? discoverTV : discoverMovies;
    fn(filters, p).then((r) => {
      setItems((prev) => (p === 1 ? r.results : [...prev, ...r.results]));
      setTotalPages(r.total_pages);
      setPage(p);
      setLoading(false);
    });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">{mediaType === 'tv' ? '📺 TV Shows' : '🎬 Movies'}</h1>
      <p className="page-subtitle">Browse and discover content</p>

      <div className="filters">
        <button
          className={`filter-chip ${!selectedGenre ? 'active' : ''}`}
          onClick={() => setSelectedGenre(null)}
        >
          All Genres
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            className={`filter-chip ${selectedGenre === g.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="filters" style={{ marginTop: -16 }}>
        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="primary_release_date.desc">Newest First</option>
          <option value="primary_release_date.asc">Oldest First</option>
          <option value="revenue.desc">Highest Revenue</option>
        </select>
      </div>

      <div className="content-grid">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            id={item.id}
            title={'title' in item ? item.title : item.name}
            posterPath={item.poster_path}
            voteAverage={item.vote_average}
            releaseDate={'release_date' in item ? item.release_date : item.first_air_date}
            mediaType={mediaType}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="load-more-wrap">
          <button className="btn btn--glass" onClick={() => fetchPage(page + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
