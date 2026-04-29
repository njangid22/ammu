import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl, getBackdropUrl } from '../services/tmdb';
import ContentRow from '../components/ContentRow';
import type { MovieDetails as MovieDetailsType, Cast, Video, Movie } from '../types/tmdb';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    getMovieDetails(Number(id)).then((data: any) => {
      setMovie(data);
      setCast(data.credits?.cast?.slice(0, 20) || []);
      setRecommendations(data.recommendations?.results?.slice(0, 20) || []);
      setSimilar(data.similar?.results?.slice(0, 20) || []);
      const vids: Video[] = data.videos?.results || [];
      const t = vids.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || vids[0];
      setTrailer(t || null);
    });
  }, [id]);

  if (!movie) return <div className="loading-spinner"><div className="spinner" /></div>;

  const hours = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;

  return (
    <>
      <section className="detail-hero">
        <div className="detail-hero__bg" style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }} />
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <div className="detail-hero__poster">
            <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} />
          </div>
          <div className="detail-hero__info">
            <div className="detail-hero__genres">
              {movie.genres.map((g) => <span key={g.id} className="detail-hero__genre">{g.name}</span>)}
            </div>
            <h1 className="detail-hero__title">{movie.title}</h1>
            {movie.tagline && <p className="detail-hero__tagline">"{movie.tagline}"</p>}
            <div className="detail-hero__meta">
              <span className="hero__rating">⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
              {movie.runtime > 0 && <span>{hours}h {mins}m</span>}
              <span style={{ textTransform: 'uppercase' }}>{movie.original_language}</span>
            </div>
            <p className="detail-hero__overview">{movie.overview}</p>
            <div className="hero__actions">
              <button className="btn btn--primary" onClick={() => navigate(`/watch/movie/${movie.id}`)}>
                ▶ Watch Now
              </button>
              {trailer && (
                <a className="btn btn--glass" href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">
                  🎬 Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="section">
          <h2 className="section__title">Cast</h2>
          <div className="cast-list">
            {cast.map((c) => (
              <div key={c.id} className="cast-card">
                {c.profile_path ? (
                  <img className="cast-card__img" src={getImageUrl(c.profile_path, 'w185')} alt={c.name} />
                ) : (
                  <div className="cast-card__img no-poster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                )}
                <div className="cast-card__name">{c.name}</div>
                <div className="cast-card__character">{c.character}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ContentRow title="Recommendations" items={recommendations} defaultMediaType="movie" />
      <ContentRow title="Similar Movies" items={similar} defaultMediaType="movie" />
    </>
  );
}
