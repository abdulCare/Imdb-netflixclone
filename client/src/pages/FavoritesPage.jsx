import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../api/favorites';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import MovieCard from '../components/MovieCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = () =>
    getFavorites()
      .then((data) => setFavorites(data.items || []))
      .catch(() => setError('Failed to load favorites'))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (favorite) => {
    await removeFavorite(favorite.tmdbType, favorite.tmdbId);
    setFavorites((prev) =>
      prev.filter((item) => !(item.tmdbId === favorite.tmdbId && item.tmdbType === favorite.tmdbType))
    );
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  if (!favorites.length) {
    return (
      <section>
        <h2>Your Favorites</h2>
        <p>No favorites yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Your Favorites</h2>
      <div className="favorites-grid">
        {favorites.map((favorite) => (
          <div key={`${favorite.tmdbType}-${favorite.tmdbId}`} className="favorite-card">
            <MovieCard item={favorite} />
            <button type="button" onClick={() => handleRemove(favorite)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FavoritesPage;
