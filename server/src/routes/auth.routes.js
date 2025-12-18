const { Router } = require('express');
const { z } = require('zod');
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const auth = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

const credentialsSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

router.post('/register', validate(credentialsSchema), asyncHandler(controller.register));
router.post('/login', validate(credentialsSchema), asyncHandler(controller.login));
router.post('/logout', auth, asyncHandler(controller.logout));
router.get('/me', auth, asyncHandler(controller.me));

module.exports = router;
