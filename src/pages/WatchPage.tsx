import { useParams, useNavigate } from 'react-router-dom';
import { getMovieEmbedUrl, getTVEmbedUrl } from '../services/vidsrc';

export default function WatchPage() {
  const { type, id, season, episode } = useParams<{
    type: string;
    id: string;
    season?: string;
    episode?: string;
  }>();
  const navigate = useNavigate();

  if (!id) return null;

  let embedUrl: string;
  let title: string;

  if (type === 'tv' && season && episode) {
    embedUrl = getTVEmbedUrl(id, Number(season), Number(episode));
    title = `S${season} E${episode}`;
  } else {
    embedUrl = getMovieEmbedUrl(id);
    title = 'Movie';
  }

  return (
    <div className="watch-page">
      <div className="watch-page__header">
        <button className="watch-page__back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <span className="watch-page__title">{title}</span>
        
        <div className="watch-page__controls" style={{ width: 40 }}>
          {/* Controls handled by the internal 2Embed player */}
        </div>
      </div>

      <div className="watch-page__player">
        <iframe
          className="watch-page__iframe"
          src={embedUrl}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          title="Video Player"
          // @ts-ignore
          webkitallowfullscreen="true"
          // @ts-ignore
          mozallowfullscreen="true"
        />
      </div>

      <div className="watch-page__footer-note">
        <p>💡 Tip: Use the player's internal menu to switch between different servers if one is slow.</p>
      </div>
    </div>
  );
}
