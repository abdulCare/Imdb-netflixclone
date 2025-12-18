import http from './http';

export const getFavorites = () =>
  http.get('/favorites', { params: { include: 'tmdb' } }).then((res) => res.data.data);

export const addFavorite = (payload) => http.post('/favorites', payload).then((res) => res.data.data);

export const removeFavorite = (tmdbType, tmdbId) =>
  http.delete(`/favorites/${tmdbType}/${tmdbId}`).then((res) => res.data.data);
