import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';

interface Props {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage?: number;
  releaseDate?: string;
  mediaType: 'movie' | 'tv';
}

export default function ContentCard({ id, title, posterPath, voteAverage, releaseDate, mediaType }: Props) {
  const navigate = useNavigate();
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = voteAverage ? voteAverage.toFixed(1) : null;
  const poster = getImageUrl(posterPath, 'w342');

  return (
    <div className="content-card" onClick={() => navigate(`/${mediaType}/${id}`)}>
      <div className="content-card__poster-wrap">
        {poster ? (
          <img className="content-card__poster" src={poster} alt={title} loading="lazy" />
        ) : (
          <div className="no-poster">No Image</div>
        )}
        {rating && (
          <span className="content-card__rating">⭐ {rating}</span>
        )}
        <div className="content-card__overlay">
          <div className="content-card__play">▶</div>
        </div>
      </div>
      <div className="content-card__title">{title}</div>
      {year && <div className="content-card__year">{year}</div>}
    </div>
  );
}
