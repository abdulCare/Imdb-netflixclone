const { Router } = require('express');
const { z } = require('zod');
const controller = require('../controllers/tmdb.controller');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate.middleware');

const router = Router();

const idSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});

router.get('/trending', asyncHandler(controller.trending));

router.get(
  '/search',
  validate(
    z.object({
      query: z.object({ q: z.string().min(1, 'Query is required') }),
      params: z.object({}).optional(),
      body: z.object({}).optional()
    })
  ),
  asyncHandler(controller.search)
);

router.get('/movie/:id', validate(idSchema), asyncHandler(controller.getMovie));
router.get('/tv/:id', validate(idSchema), asyncHandler(controller.getTv));

module.exports = router;
