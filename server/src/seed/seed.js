const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const { env } = require('../config/env');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Watchlist = require('../models/Watchlist');
const Review = require('../models/Review');

const run = async () => {
  await connectDB();

  await Promise.all([Favorite.deleteMany({}), Watchlist.deleteMany({}), Review.deleteMany({})]);
  await User.deleteMany({ email: 'demo@abdulflix.com' });

  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await User.create({ email: 'demo@abdulflix.com', passwordHash });

  await Favorite.create([
    { userId: user._id, tmdbType: 'movie', tmdbId: 278 },
    { userId: user._id, tmdbType: 'tv', tmdbId: 1396 }
  ]);

  await Watchlist.create({
    userId: user._id,
    name: 'Weekend Binge',
    items: [
      { tmdbType: 'movie', tmdbId: 424 },
      { tmdbType: 'tv', tmdbId: 66732 }
    ]
  });

  await Review.create({
    userId: user._id,
    tmdbType: 'movie',
    tmdbId: 550,
    rating: 8,
    text: 'Such a classic!'
  });

  console.log('Seed complete. Demo user: demo@abdulflix.com / password123');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
