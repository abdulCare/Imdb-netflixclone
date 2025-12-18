const Watchlist = require('../models/Watchlist');
const { mergeWithDetails } = require('../services/merge.service');

const toPlain = (doc) => (typeof doc.toObject === 'function' ? doc.toObject() : doc);

const includeTmdbItems = async (watchlist, includeTmdb) => {
  if (!includeTmdb) {
    return watchlist;
  }
  const plain = toPlain(watchlist);
  return {
    ...plain,
    items: await mergeWithDetails(plain.items || [])
  };
};

const createWatchlist = async (req, res) => {
  const watchlist = await Watchlist.create({
    userId: req.user.id,
    name: req.body.name,
    items: []
  });
  res.status(201).json({ data: { watchlist } });
};

const listWatchlists = async (req, res) => {
  const includeTmdb = req.query.include === 'tmdb';
  const watchlists = await Watchlist.find({ userId: req.user.id }).lean();
  const data = includeTmdb
    ? await Promise.all(watchlists.map((watchlist) => includeTmdbItems(watchlist, includeTmdb)))
    : watchlists;
  res.json({ data: { watchlists: data } });
};

const updateItems = async (req, res) => {
  const { action, tmdbType, tmdbId } = req.body;
  const includeTmdb = req.query.include === 'tmdb';
  const watchlist = await Watchlist.findOne({ _id: req.params.id, userId: req.user.id });

  if (!watchlist) {
    return res.status(404).json({
      error: {
        message: 'Watchlist not found',
        code: 'WATCHLIST_NOT_FOUND'
      }
    });
  }

  if (action === 'add') {
    const exists = watchlist.items.some((item) => item.tmdbId === tmdbId && item.tmdbType === tmdbType);
    if (!exists) {
      watchlist.items.push({ tmdbType, tmdbId });
    }
  } else if (action === 'remove') {
    watchlist.items = watchlist.items.filter(
      (item) => !(item.tmdbId === tmdbId && item.tmdbType === tmdbType)
    );
  }

  await watchlist.save();
  const formatted = await includeTmdbItems(watchlist, includeTmdb);
  res.json({ data: { watchlist: formatted } });
};

module.exports = {
  createWatchlist,
  listWatchlists,
  updateItems
};
