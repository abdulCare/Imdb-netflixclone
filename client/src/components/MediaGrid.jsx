import MovieCard from './MovieCard';
import EmptyState from './EmptyState';

const MediaGrid = ({ items }) => {
  if (!items?.length) {
    return <EmptyState message="Nothing to show yet." />;
  }

  return (
    <div className="media-grid">
      {items.map((item) => (
        <MovieCard key={`${item.media_type || item.tmdbType || 'media'}-${item.id || item.tmdbId}`} item={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
