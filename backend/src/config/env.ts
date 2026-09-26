import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/careerstream?schema=public',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'careerstream-super-secret-jwt-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'careerstream-super-secret-refresh-key-2026',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SYNC_INTERVAL_HOURS: parseInt(process.env.SYNC_INTERVAL_HOURS || '6', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};
