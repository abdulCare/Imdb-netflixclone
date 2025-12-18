const Review = require('../models/Review');

const createReview = async (req, res) => {
  const review = await Review.create({
    userId: req.user.id,
    tmdbType: req.body.tmdbType,
    tmdbId: req.body.tmdbId,
    rating: req.body.rating,
    text: req.body.text
  });

  res.status(201).json({ data: { review } });
};

const listReviews = async (req, res) => {
  const reviews = await Review.find({
    tmdbType: req.params.tmdbType,
    tmdbId: Number(req.params.tmdbId)
  })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ data: { reviews } });
};

module.exports = {
  createReview,
  listReviews
};
