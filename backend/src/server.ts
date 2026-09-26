import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB, prisma } from './database/db.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { syncEngine } from './sync/reconciler.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// Healthcheck Endpoints
app.get(['/health', '/api/health'], (req, res) => {
  res.json({ status: 'UP', service: 'Career Stream Backend API', timestamp: new Date().toISOString() });
});

app.get('/health/database', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'HEALTHY', database: 'PostgreSQL' });
  } catch (err) {
    res.status(500).json({ status: 'UNHEALTHY', error: (err as Error).message });
  }
});

// Mount Main V1 API Router
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT;

async function startServer() {
  await connectDB();

  // Run initial job synchronization in background on startup
  setTimeout(async () => {
    console.log(' Starting initial background job synchronization...');
    try {
      await syncEngine.syncAll();
      console.log(' Initial job synchronization completed successfully.');
    } catch (e) {
      console.warn('⚠️ Background sync warning:', (e as Error).message);
    }
  }, 2000);

  app.listen(PORT, () => {
    console.log(`🚀 Career Stream API Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
  });
}

startServer();
