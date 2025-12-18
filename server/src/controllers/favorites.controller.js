const Favorite = require('../models/Favorite');
const { mergeWithDetails } = require('../services/merge.service');

const listFavorites = async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.id }).lean();
  const includeTmdb = req.query.include === 'tmdb';
  const items = includeTmdb ? await mergeWithDetails(favorites) : favorites;
  res.json({ data: { items } });
};

const addFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.create({
      userId: req.user.id,
      tmdbType: req.body.tmdbType,
      tmdbId: req.body.tmdbId
    });
    res.status(201).json({ data: { favorite } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: {
          message: 'Favorite already exists',
          code: 'FAVORITE_EXISTS'
        }
      });
    }
    next(error);
  }
};

const removeFavorite = async (req, res) => {
  await Favorite.findOneAndDelete({
    userId: req.user.id,
    tmdbType: req.params.tmdbType,
    tmdbId: Number(req.params.tmdbId)
  });
  res.json({ data: { success: true } });
};

module.exports = {
  listFavorites,
  addFavorite,
  removeFavorite
};
