import http from './http';

export const getWatchlists = (params = {}) =>
  http.get('/watchlists', { params }).then((res) => res.data.data);
export const createWatchlist = (payload) => http.post('/watchlists', payload).then((res) => res.data.data);
export const updateWatchlistItems = (id, payload, params = {}) =>
  http.patch(`/watchlists/${id}/items`, payload, { params }).then((res) => res.data.data);
