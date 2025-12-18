const axios = require('axios');
const { env } = require('./env');

const tmdbClient = axios.create({
  baseURL: env.TMDB_BASE_URL,
  timeout: 5000
});

tmdbClient.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    api_key: env.TMDB_API_KEY
  };
  return config;
});

module.exports = tmdbClient;
