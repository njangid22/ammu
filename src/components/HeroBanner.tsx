import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBackdropUrl } from '../services/tmdb';
import type { MediaItem } from '../types/tmdb';

interface Props {
  items: MediaItem[];
}

export default function HeroBanner({ items }: Props) {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setIdx((p) => (p + 1) % items.length), 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[idx];
  const title = 'title' in item ? item.title : ('name' in item ? item.name : '');
  const date = 'release_date' in item ? item.release_date : ('first_air_date' in item ? item.first_air_date : '');
  const year = date ? new Date(date).getFullYear() : '';
  const mediaType = item.media_type || ('title' in item ? 'movie' : 'tv');
  const backdrop = getBackdropUrl(item.backdrop_path);

  return (
    <section className="hero">
      <div className="hero__backdrop" style={{ backgroundImage: `url(${backdrop})` }} />
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__tag">🔥 Trending Now</div>
        <h1 className="hero__title">{title}</h1>
        <div className="hero__meta">
          <span className="hero__rating">⭐ {item.vote_average?.toFixed(1)}</span>
          {year && <span className="hero__year">{year}</span>}
          <span className="hero__type" style={{ textTransform: 'capitalize' }}>{mediaType}</span>
        </div>
        <p className="hero__overview">{item.overview}</p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={() => navigate(`/watch/${mediaType}/${item.id}`)}>
            ▶ Watch Now
          </button>
          <button className="btn btn--glass" onClick={() => navigate(`/${mediaType}/${item.id}`)}>
            ℹ️ More Info
          </button>
        </div>
      </div>
    </section>
  );
}
