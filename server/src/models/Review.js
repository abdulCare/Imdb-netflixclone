const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    text: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

reviewSchema.index({ tmdbType: 1, tmdbId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
