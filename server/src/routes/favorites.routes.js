const { Router } = require('express');
const { z } = require('zod');
const controller = require('../controllers/favorites.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

const typeEnum = z.enum(['movie', 'tv']);

router.get(
  '/',
  auth,
  validate(
    z.object({
      query: z.object({ include: z.literal('tmdb').optional() }),
      params: z.object({}).optional(),
      body: z.object({}).optional()
    })
  ),
  asyncHandler(controller.listFavorites)
);

router.post(
  '/',
  auth,
  validate(
    z.object({
      body: z.object({
        tmdbType: typeEnum,
        tmdbId: z.coerce.number().int().positive()
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional()
    })
  ),
  asyncHandler(controller.addFavorite)
);

router.delete(
  '/:tmdbType/:tmdbId',
  auth,
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
  asyncHandler(controller.removeFavorite)
);

module.exports = router;
