const { config } = require('dotenv');
const { z } = require('zod');

config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is required'),
  TMDB_BASE_URL: z.string().url('TMDB_BASE_URL must be a valid url'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CORS_ORIGIN: z.string().url('CORS_ORIGIN must be a valid url')
});

const env = envSchema.parse(process.env);

module.exports = { env };
