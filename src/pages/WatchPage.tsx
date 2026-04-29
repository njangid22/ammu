import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useCallback } from 'react';
import { getMovieEmbedUrl, getTVEmbedUrl } from '../services/vidsrc';

export default function WatchPage() {
  const { type, id, season, episode } = useParams<{
    type: string;
    id: string;
    season?: string;
    episode?: string;
  }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {
        // Fallback: try on iframe directly
        iframeRef.current?.requestFullscreen?.();
      });
    }
  }, []);

  if (!id) return null;

  const numId = Number(id);
  let embedUrl: string;
  let title: string;

  if (type === 'tv' && season && episode) {
    embedUrl = getTVEmbedUrl(numId, Number(season), Number(episode), { autoplay: 1, autonext: 1 });
    title = `S${season} E${episode}`;
  } else {
    embedUrl = getMovieEmbedUrl(numId, { autoplay: 1 });
    title = 'Movie';
  }

  return (
    <div className="watch-page">
      <div className="watch-page__header">
        <button className="watch-page__back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className="watch-page__title">{title}</span>
        <div className="watch-page__controls">
          <button className="watch-page__ctrl-btn" onClick={toggleFullscreen} title="Fullscreen">
            ⛶
          </button>
        </div>
      </div>
      <div className="watch-page__player" ref={containerRef}>
        <iframe
          ref={iframeRef}
          className="watch-page__iframe"
          src={embedUrl}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          title="Video Player"
        />
      </div>
    </div>
  );
}
