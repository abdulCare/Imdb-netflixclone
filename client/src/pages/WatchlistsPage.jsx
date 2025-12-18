import { useEffect, useState } from 'react';
import { createWatchlist, getWatchlists, updateWatchlistItems } from '../api/watchlists';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';

const WatchlistsPage = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const loadWatchlists = () =>
    getWatchlists({ include: 'tmdb' })
      .then((data) => setWatchlists(data.watchlists || []))
      .catch(() => setError('Unable to fetch watchlists'))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadWatchlists();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { watchlist } = await createWatchlist({ name });
      setWatchlists((prev) => [...prev, watchlist]);
      setName('');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveItem = async (watchlistId, item) => {
    const payload = {
      action: 'remove',
      tmdbType: item.tmdbType,
      tmdbId: item.tmdbId
    };
    const { watchlist } = await updateWatchlistItems(watchlistId, payload, { include: 'tmdb' });
    setWatchlists((prev) => prev.map((list) => (list._id === watchlistId ? watchlist : list)));
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Watchlists</h2>
      <form className="watchlist-form" onSubmit={handleCreate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New watchlist name" />
        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create'}
        </button>
      </form>
      <div className="watchlists">
        {watchlists.map((list) => (
          <div key={list._id} className="watchlist-card">
            <h3>{list.name}</h3>
            <p>{list.items?.length || 0} items</p>
            {!!list.items?.length && (
              <ul className="watchlist-items">
                {list.items.map((item) => (
                  <li key={`${item.tmdbType}-${item.tmdbId}`}>
                    <span>{item.tmdb?.title || item.tmdb?.name || `${item.tmdbType.toUpperCase()} #${item.tmdbId}`}</span>
                    <button type="button" onClick={() => handleRemoveItem(list._id, item)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WatchlistsPage;
