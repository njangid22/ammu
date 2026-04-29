import ContentCard from './ContentCard';

interface Item {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

interface Props {
  title: string;
  items: Item[];
  defaultMediaType?: 'movie' | 'tv';
}

export default function ContentRow({ title, items, defaultMediaType = 'movie' }: Props) {
  if (!items.length) return null;

  return (
    <section className="content-row">
      <div className="content-row__header">
        <h2 className="content-row__title">{title}</h2>
      </div>
      <div className="content-row__scroll">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            id={item.id}
            title={item.title || item.name || ''}
            posterPath={item.poster_path}
            voteAverage={item.vote_average}
            releaseDate={item.release_date || item.first_air_date}
            mediaType={(item.media_type as 'movie' | 'tv') || defaultMediaType}
          />
        ))}
      </div>
    </section>
  );
}
