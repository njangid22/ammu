import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTVDetails, getTVSeasonDetails, getImageUrl, getBackdropUrl } from '../services/tmdb';
import ContentRow from '../components/ContentRow';
import type { TVDetails as TVDetailsType, Cast, Video, Episode, TVShow } from '../types/tmdb';

export default function TVDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVDetailsType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<TVShow[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    getTVDetails(Number(id)).then((data: any) => {
      setShow(data);
      setCast(data.credits?.cast?.slice(0, 20) || []);
      setRecommendations(data.recommendations?.results?.slice(0, 20) || []);
      const vids: Video[] = data.videos?.results || [];
      setTrailer(vids.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || vids[0] || null);
      if (data.seasons?.length) {
        const first = data.seasons.find((s: any) => s.season_number >= 1);
        if (first) setSelectedSeason(first.season_number);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getTVSeasonDetails(Number(id), selectedSeason).then((data) => {
      setEpisodes(data.episodes || []);
    }).catch(() => setEpisodes([]));
  }, [id, selectedSeason]);

  if (!show) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <section className="detail-hero">
        <div className="detail-hero__bg" style={{ backgroundImage: `url(${getBackdropUrl(show.backdrop_path)})` }} />
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <div className="detail-hero__poster">
            <img src={getImageUrl(show.poster_path, 'w500')} alt={show.name} />
          </div>
          <div className="detail-hero__info">
            <div className="detail-hero__genres">
              {show.genres.map((g) => <span key={g.id} className="detail-hero__genre">{g.name}</span>)}
            </div>
            <h1 className="detail-hero__title">{show.name}</h1>
            {show.tagline && <p className="detail-hero__tagline">"{show.tagline}"</p>}
            <div className="detail-hero__meta">
              <span className="hero__rating">⭐ {show.vote_average.toFixed(1)}</span>
              <span>{new Date(show.first_air_date).getFullYear()}</span>
              <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
              <span>{show.status}</span>
            </div>
            <p className="detail-hero__overview">{show.overview}</p>
            <div className="hero__actions">
              <button className="btn btn--primary" onClick={() => navigate(`/watch/tv/${show.id}/1/1`)}>
                ▶ Watch S1 E1
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

      {/* Seasons & Episodes */}
      {show.seasons.length > 0 && (
        <div className="section">
          <h2 className="section__title">Episodes</h2>
          <div className="season-selector">
            {show.seasons.filter((s) => s.season_number >= 1).map((s) => (
              <button
                key={s.id}
                className={`filter-chip ${selectedSeason === s.season_number ? 'active' : ''}`}
                onClick={() => setSelectedSeason(s.season_number)}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>
          <div className="episode-list">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="episode-card"
                onClick={() => navigate(`/watch/tv/${show.id}/${ep.season_number}/${ep.episode_number}`)}
              >
                {ep.still_path ? (
                  <img className="episode-card__still" src={getImageUrl(ep.still_path, 'w300')} alt={ep.name} />
                ) : (
                  <div className="episode-card__still no-poster">No Preview</div>
                )}
                <div className="episode-card__info">
                  <div className="episode-card__number">Episode {ep.episode_number}</div>
                  <div className="episode-card__name">{ep.name}</div>
                  <div className="episode-card__overview">{ep.overview}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ContentRow title="Recommendations" items={recommendations} defaultMediaType="tv" />
    </>
  );
}
