import { useEffect, useState } from 'react';
import MediaGrid from '../components/MediaGrid';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { getTrending } from '../api/media';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrending()
      .then(setItems)
      .catch(() => setError('Unable to load trending titles'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Trending Now</h2>
      <MediaGrid items={items} />
    </section>
  );
};

export default HomePage;
