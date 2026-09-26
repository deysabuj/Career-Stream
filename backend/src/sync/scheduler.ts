import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { syncEngine } from './reconciler.js';
import { connectorRegistry } from '../connectors/registry.js';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true
});

export const syncQueue = new Queue('company-sync-queue', { connection });

/**
 * Enqueues sync jobs for all registered connectors with staggered delay offsets.
 */
export async function scheduleAllCompanySyncs(): Promise<void> {
  const connectors = connectorRegistry.getAllConnectors();
  let delayMs = 0;

  console.log(`[Scheduler] Scheduling staggered sync jobs for ${connectors.length} companies every 6 hours...`);

  for (const connector of connectors) {
    await syncQueue.add(
      'sync-company',
      { companySlug: connector.companySlug },
      {
        delay: delayMs,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    delayMs += 5000; // 5-second stagger delay per company
  }
}

/**
 * Worker process executing staggered company sync jobs.
 */
export const syncWorker = new Worker(
  'company-sync-queue',
  async (job: Job<{ companySlug: string }>) => {
    console.log(`[Worker] Starting scheduled sync for company: ${job.data.companySlug}...`);
    const result = await syncEngine.syncCompany(job.data.companySlug);
    console.log(`[Worker] Completed sync for ${job.data.companySlug}: Status = ${result.status}`);
    return result;
  },
  {
    connection,
    concurrency: 2, // Concurrency limit of 2 parallel company syncs
  }
);
