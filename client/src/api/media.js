import http from './http';

export const getTrending = () => http.get('/tmdb/trending').then((res) => res.data.data);
export const searchMedia = (query) => http.get('/tmdb/search', { params: { q: query } }).then((res) => res.data.data);
export const getDetails = (type, id) =>
  http.get(`/${type === 'tv' ? 'tmdb/tv' : 'tmdb/movie'}/${id}`).then((res) => res.data.data);
export const getReviews = (type, id) => http.get(`/reviews/${type}/${id}`).then((res) => res.data.data);
export const createReview = (payload) => http.post('/reviews', payload).then((res) => res.data.data);
