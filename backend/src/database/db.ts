import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export let isDBConnected = false;

export async function connectDB() {
  try {
    // Set a fast 2s connection timeout check
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 2000)),
    ]);
    isDBConnected = true;
    console.log('[DATABASE] PostgreSQL connected successfully');
    return true;
  } catch (error) {
    isDBConnected = false;
    console.warn('[DATABASE] PostgreSQL unavailable — fallback mode active');
    return false;
  }
}
