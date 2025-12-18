const { Router } = require('express');
const { z } = require('zod');
const controller = require('../controllers/reviews.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();
const typeEnum = z.enum(['movie', 'tv']);

router.post(
  '/',
  auth,
  validate(
    z.object({
      body: z.object({
        tmdbType: typeEnum,
        tmdbId: z.coerce.number().int().positive(),
        rating: z.coerce.number().int().min(1).max(10),
        text: z.string().max(2000).optional()
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional()
    })
  ),
  asyncHandler(controller.createReview)
);

router.get(
  '/:tmdbType/:tmdbId',
  validate(
    z.object({
      params: z.object({
        tmdbType: typeEnum,
        tmdbId: z.coerce.number().int().positive()
      }),
      body: z.object({}).optional(),
      query: z.object({}).optional()
    })
  ),
  asyncHandler(controller.listReviews)
);

module.exports = router;
