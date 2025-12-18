const { Router } = require('express');
const { z } = require('zod');
const controller = require('../controllers/watchlists.controller');
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
      body: z.object({ name: z.string().min(1) }),
      params: z.object({}).optional(),
      query: z.object({}).optional()
    })
  ),
  asyncHandler(controller.createWatchlist)
);

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
  asyncHandler(controller.listWatchlists)
);

router.patch(
  '/:id/items',
  auth,
  validate(
    z.object({
      params: z.object({ id: z.string().min(1) }),
      body: z.object({
        action: z.enum(['add', 'remove']),
        tmdbType: typeEnum,
        tmdbId: z.coerce.number().int().positive()
      }),
      query: z.object({ include: z.literal('tmdb').optional() })
    })
  ),
  asyncHandler(controller.updateItems)
);

module.exports = router;
