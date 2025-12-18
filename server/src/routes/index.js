const { Router } = require('express');
const tmdbRoutes = require('./tmdb.routes');
const authRoutes = require('./auth.routes');
const favoritesRoutes = require('./favorites.routes');
const watchlistsRoutes = require('./watchlists.routes');
const reviewsRoutes = require('./reviews.routes');

const router = Router();

router.use('/tmdb', tmdbRoutes);
router.use('/auth', authRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/watchlists', watchlistsRoutes);
router.use('/reviews', reviewsRoutes);

module.exports = router;
