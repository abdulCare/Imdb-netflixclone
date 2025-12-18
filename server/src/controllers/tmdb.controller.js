const tmdbService = require('../services/tmdb.service');

const trending = async (req, res) => {
  const data = await tmdbService.getTrending();
  res.json({ data });
};

const search = async (req, res) => {
  const data = await tmdbService.search(req.query.q);
  res.json({ data });
};

const getMovie = async (req, res) => {
  const data = await tmdbService.getMovie(req.params.id);
  res.json({ data });
};

const getTv = async (req, res) => {
  const data = await tmdbService.getTv(req.params.id);
  res.json({ data });
};

module.exports = {
  trending,
  search,
  getMovie,
  getTv
};
