const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tmdbType: {
      type: String,
      enum: ['movie', 'tv'],
      required: true
    },
    tmdbId: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, tmdbType: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
