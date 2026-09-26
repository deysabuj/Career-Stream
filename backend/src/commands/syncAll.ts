import { connectorRegistry } from '../connectors/registry.js';
import { SyncEngine, SyncRunResult } from '../sync/reconciler.js';
import { prisma } from '../database/db.js';

const CONCURRENCY_LIMIT = 3;

async function runAsyncPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<any>[] = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p as any);

    if (limit <= items.length) {
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

async function runSyncAll() {
  console.log('==================================================');
  console.log('CAREER STREAM V4 - FULL PARALLEL STAGGERED SYNC');
  console.log('==================================================\n');

  const engine = new SyncEngine();
  const connectors = connectorRegistry.getAllConnectors();
  const startedAt = new Date();

  console.log(`Loaded ${connectors.length} connectors. Processing with concurrency limit = ${CONCURRENCY_LIMIT}...\n`);

  const results: SyncRunResult[] = await runAsyncPool(
    connectors,
    CONCURRENCY_LIMIT,
    async (connector) => {
      console.log(`[SyncAll] Starting sync for ${connector.companyName} (${connector.companySlug})...`);
      try {
        const res = await engine.syncCompany(connector.companySlug);
        console.log(`[SyncAll] Completed ${connector.companyName}: Status = ${res.status} | Fetched: ${res.jobsFetched} | Inserted: ${res.jobsInserted}`);
        return res;
      } catch (err: any) {
        console.error(`[SyncAll] Error syncing ${connector.companyName}: ${err.message}`);
        return {
          companyName: connector.companyName,
          jobsFetched: 0,
          jobsInserted: 0,
          jobsUpdated: 0,
          jobsExpired: 0,
          jobsRejected: 0,
          status: 'FAILED',
          errorMessage: err.message,
        };
      }
    }
  );

  console.log('\n==================================================');
  console.log('SYNC ALL SUMMARY REPORT');
  console.log('==================================================');

  let totalFetched = 0;
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalExpired = 0;
  let successCount = 0;
  let blockedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    totalFetched += r.jobsFetched;
    totalInserted += r.jobsInserted;
    totalUpdated += r.jobsUpdated;
    totalExpired += r.jobsExpired;

    if (r.status === 'SUCCESS') successCount++;
    else if (r.status === 'SOURCE_BLOCKED') blockedCount++;
    else failedCount++;
  }

  console.log(`Total Connectors Processed: ${results.length}`);
  console.log(`Success (Live): ${successCount}`);
  console.log(`Source Blocked: ${blockedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Total Raw Jobs Fetched: ${totalFetched}`);
  console.log(`Total Jobs Inserted: ${totalInserted}`);
  console.log(`Total Jobs Updated: ${totalUpdated}`);
  console.log(`Total Jobs Expired: ${totalExpired}`);

  const activeCount = await prisma.job.count({ where: { status: 'ACTIVE' } });
  console.log(`\nTOTAL ACTIVE EARLY-CAREER JOBS IN DATABASE: ${activeCount}`);

  await prisma.$disconnect();
}

runSyncAll().catch(console.error);
