const tmdbClient = require('../config/tmdbClient');

const cache = new Map();

const ttl = {
  trending: 20 * 60 * 1000,
  search: 3 * 60 * 1000,
  details: 12 * 60 * 60 * 1000
};

const getCache = (key) => {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, value, duration) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + duration
  });
};

const normalizeMedia = (item) => ({
  id: item.id,
  title: item.title || item.name,
  name: item.name,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  overview: item.overview,
  vote_average: item.vote_average,
  release_date: item.release_date,
  first_air_date: item.first_air_date,
  media_type: item.media_type
});

const fetchWithCache = async (key, duration, request) => {
  const cached = getCache(key);
  if (cached) {
    return cached;
  }
  const response = await request();
  setCache(key, response, duration);
  return response;
};

const getTrending = async () => {
  return fetchWithCache('trending', ttl.trending, async () => {
    const { data } = await tmdbClient.get('/trending/all/week');
    return data.results.map(normalizeMedia);
  });
};

const search = async (query) => {
  return fetchWithCache(`search:${query}`, ttl.search, async () => {
    const { data } = await tmdbClient.get('/search/multi', {
      params: { query }
    });
    return data.results.map(normalizeMedia);
  });
};

const getMovie = async (id) => {
  return fetchWithCache(`movie:${id}`, ttl.details, async () => {
    const { data } = await tmdbClient.get(`/movie/${id}`);
    return normalizeMedia(data);
  });
};

const getTv = async (id) => {
  return fetchWithCache(`tv:${id}`, ttl.details, async () => {
    const { data } = await tmdbClient.get(`/tv/${id}`);
    return normalizeMedia(data);
  });
};

module.exports = {
  getTrending,
  search,
  getMovie,
  getTv
};
