import http from './http';

export const login = (credentials) => http.post('/auth/login', credentials).then((res) => res.data.data);
export const register = (payload) => http.post('/auth/register', payload).then((res) => res.data.data);
export const logout = () => http.post('/auth/logout').then((res) => res.data.data);
export const fetchMe = () => http.get('/auth/me').then((res) => res.data.data);
