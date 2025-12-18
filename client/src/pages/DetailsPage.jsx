import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { getDetails, getReviews, createReview } from '../api/media';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorites';
import { getWatchlists, updateWatchlistItems } from '../api/watchlists';
import { useAuth } from '../context/AuthContext';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(10),
  text: z.string().max(1000).optional()
});

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const DetailsPage = () => {
  const { type, id } = useParams();
  const { isAuthed } = useAuth();
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchlists, setWatchlists] = useState([]);
  const [watchlistsLoading, setWatchlistsLoading] = useState(false);
  const [watchlistUpdatingId, setWatchlistUpdatingId] = useState(null);
  const [watchlistMessage, setWatchlistMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 7, text: '' }
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([getDetails(type, id), getReviews(type, id)])
      .then(([media, reviewData]) => {
        setDetails(media);
        setReviews(reviewData.reviews || []);
      })
      .catch(() => setError('Unable to load details'))
      .finally(() => setLoading(false));
  }, [type, id]);

  useEffect(() => {
    if (!isAuthed) {
      setIsFavorite(false);
      setWatchlists([]);
      setWatchlistsLoading(false);
      return;
    }
    setWatchlistsLoading(true);
    getFavorites()
      .then((data) => {
        const exists = data.items?.some((item) => item.tmdbId === Number(id) && item.tmdbType === type);
        setIsFavorite(exists);
      })
      .catch(() => setIsFavorite(false));
    getWatchlists()
      .then((data) => setWatchlists(data.watchlists || []))
      .catch(() => setWatchlists([]))
      .finally(() => setWatchlistsLoading(false));
  }, [isAuthed, id, type]);

  const toggleFavorite = async () => {
    if (!isAuthed) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(type, Number(id));
        setIsFavorite(false);
      } else {
        await addFavorite({ tmdbType: type, tmdbId: Number(id) });
        setIsFavorite(true);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const onSubmitReview = async (values) => {
    await createReview({ tmdbType: type, tmdbId: Number(id), ...values });
    reset({ rating: 7, text: '' });
    const refreshed = await getReviews(type, id);
    setReviews(refreshed.reviews || []);
  };

  const isItemInWatchlist = (watchlist) =>
    watchlist.items?.some((item) => item.tmdbId === Number(id) && item.tmdbType === type);

  const handleWatchlistToggle = async (watchlist) => {
    const inList = isItemInWatchlist(watchlist);
    setWatchlistUpdatingId(watchlist._id);
    setWatchlistMessage('');
    try {
      const payload = {
        action: inList ? 'remove' : 'add',
        tmdbType: type,
        tmdbId: Number(id)
      };
      const { watchlist: updated } = await updateWatchlistItems(watchlist._id, payload);
      setWatchlists((prev) => prev.map((list) => (list._id === watchlist._id ? updated : list)));
      setWatchlistMessage(`${inList ? 'Removed from' : 'Added to'} ${watchlist.name}`);
    } finally {
      setWatchlistUpdatingId(null);
    }
  };

  const imageUrl = useMemo(() => {
    if (!details) return null;
    const source = details.poster_path || details.backdrop_path;
    return source ? `${IMAGE_BASE}${source}` : null;
  }, [details]);

  if (loading) return <Spinner />;
  if (error || !details) return <ErrorState message={error || 'Details missing'} />;

  const title = details.title || details.name;
  const overview = details.overview || 'No description available.';
  const rating = typeof details.vote_average === 'number' ? details.vote_average.toFixed(1) : null;

  return (
    <section className="details-page">
      <div className="details-layout">
        <div className="details-main">
          <div className="details-panel details-header">
            <h1>{title}</h1>
            {rating && <p className="details-rating">Rating: {rating}/10</p>}
            <button type="button" disabled={!isAuthed || favoriteLoading} onClick={toggleFavorite}>
              {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            </button>
          </div>

          <div className="details-panel reviews">
            <h3>Reviews</h3>
            {!reviews.length && <p>No reviews yet.</p>}
            <ul>
              {reviews.map((review) => (
                <li key={review._id}>
                  <strong>{review.rating}/10</strong>
                  <p>{review.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {isAuthed && (
            <form className="review-form details-panel" onSubmit={handleSubmit(onSubmitReview)}>
              <h4>Leave a review</h4>
              <label>
                Rating
                <input type="number" min="1" max="10" {...register('rating', { valueAsNumber: true })} />
              </label>
              {errors.rating && <span className="error">{errors.rating.message}</span>}
              <label>
                Thoughts
                <textarea rows="4" {...register('text')} />
              </label>
              {errors.text && <span className="error">{errors.text.message}</span>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Submit Review'}
              </button>
            </form>
          )}

          {isAuthed && (
            <div className="watchlist-actions details-panel">
              <h4>Watchlists</h4>
              {watchlistMessage && <p className="success">{watchlistMessage}</p>}
              {watchlistsLoading && <Spinner />}
              {!watchlistsLoading && watchlists.length === 0 && (
                <p>
                  No watchlists yet. Create one from the <strong>Watchlists</strong> page.
                </p>
              )}
              <div className="watchlist-buttons">
                {watchlists.map((watchlist) => {
                  const inList = isItemInWatchlist(watchlist);
                  return (
                    <button
                      key={watchlist._id}
                      type="button"
                      onClick={() => handleWatchlistToggle(watchlist)}
                      disabled={watchlistUpdatingId === watchlist._id}
                    >
                      {inList ? 'Remove from' : 'Add to'} {watchlist.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="details-sidebar details-panel">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="hero" />
          ) : (
            <div className="hero placeholder" aria-label="No artwork available" />
          )}
          <div className="details-description">
            <h4>Overview</h4>
            <p>{overview}</p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default DetailsPage;
