const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    tmdbType: {
      type: String,
      enum: ['movie', 'tv'],
      required: true
    },
    tmdbId: {
      type: Number,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    items: [itemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);
