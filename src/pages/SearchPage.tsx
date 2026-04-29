import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentCard from '../components/ContentCard';
import { searchMulti } from '../services/tmdb';
import type { SearchResult } from '../types/tmdb';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  useEffect(() => {
    if (!query) return;
    setPage(1);
    setLoading(true);
    searchMulti(query, 1).then((r) => {
      setResults(r.results);
      setTotalPages(r.total_pages);
      setLoading(false);
    });
  }, [query]);

  const loadMore = () => {
    if (page >= totalPages) return;
    const next = page + 1;
    setLoading(true);
    searchMulti(query, next).then((r) => {
      setResults((prev) => [...prev, ...r.results]);
      setPage(next);
      setLoading(false);
    });
  };

  const filtered = results.filter((r) => {
    if (filter === 'all') return r.media_type === 'movie' || r.media_type === 'tv';
    return r.media_type === filter;
  });

  return (
    <div className="page-container">
      <h1 className="page-title">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      <p className="page-subtitle">{filtered.length} results found</p>

      <div className="filters">
        {(['all', 'movie', 'tv'] as const).map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV Shows'}
          </button>
        ))}
      </div>

      <div className="content-grid">
        {filtered.map((item) => (
          <ContentCard
            key={`${item.media_type}-${item.id}`}
            id={item.id}
            title={item.title || item.name || ''}
            posterPath={item.poster_path}
            voteAverage={item.vote_average}
            releaseDate={item.release_date || item.first_air_date}
            mediaType={item.media_type as 'movie' | 'tv'}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="load-more-wrap">
          <button className="btn btn--glass" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
