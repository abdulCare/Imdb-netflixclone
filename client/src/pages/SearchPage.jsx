import { useEffect, useState } from 'react';
import MediaGrid from '../components/MediaGrid';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { searchMedia } from '../api/media';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      searchMedia(query)
        .then(setResults)
        .catch(() => setError('Search failed'))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section>
      <h2>Search</h2>
      <input
        type="search"
        placeholder="Find movies or shows"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <Spinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && <MediaGrid items={results} />}
    </section>
  );
};

export default SearchPage;
