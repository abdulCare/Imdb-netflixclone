const { getMovie, getTv } = require('./tmdb.service');

const limit = 5;

const toPlain = (favorite) =>
  typeof favorite.toObject === 'function' ? favorite.toObject() : favorite;

const mergeWithDetails = async (items) => {
  let index = 0;
  const results = new Array(items.length);

  const worker = async () => {
    while (index < items.length) {
      const currentIndex = index++;
      const favorite = items[currentIndex];
      const plainFavorite = toPlain(favorite);
      try {
        const tmdbData = favorite.tmdbType === 'movie'
          ? await getMovie(favorite.tmdbId)
          : await getTv(favorite.tmdbId);
        results[currentIndex] = {
          ...plainFavorite,
          tmdb: tmdbData
        };
      } catch (error) {
        results[currentIndex] = {
          ...plainFavorite,
          tmdb: null
        };
      }
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length || 1) }, () => worker());
  await Promise.all(workers);
  return results;
};

module.exports = { mergeWithDetails };
