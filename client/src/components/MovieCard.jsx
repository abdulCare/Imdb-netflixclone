import { Link } from 'react-router-dom';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

const MovieCard = ({ item }) => {
  const details = item.tmdb || item;
  const type = item.tmdbType || details.media_type || 'movie';
  const id = details.id || item.tmdbId;
  const title = details.title || details.name;
  const poster = details.poster_path ? `${IMAGE_BASE}${details.poster_path}` : null;
  const year = details.release_date || details.first_air_date;

  return (
    <Link to={`/details/${type}/${id}`} className="movie-card">
      {poster ? <img src={poster} alt={title} loading="lazy" /> : <div className="placeholder" />}
      <div className="movie-card__info">
        <h3>{title}</h3>
        {year && <p>{new Date(year).getFullYear()}</p>}
      </div>
    </Link>
  );
};

export default MovieCard;
