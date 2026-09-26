import { SyncEngine } from './sync/reconciler.js';
import { prisma } from './database/db.js';

const engine = new SyncEngine();

const liveSlugs = [
  'amazon',
  'adobe',
  'tcs',
  'zscaler',
  'nvidia',
  'coursera',
  'accenture',
  'cisco',
  'pwc',
  'hul'
];

async function runLiveSync() {
  console.log('==================================================');
  console.log('RUNNING SYNC ACROSS ALL VERIFIED LIVE CONNECTORS');
  console.log('==================================================\n');

  for (const slug of liveSlugs) {
    console.log(`\n--- Syncing ${slug} ---`);
    try {
      const res = await engine.syncCompany(slug);
      console.log(`[${slug}] Status: ${res.status} | Fetched: ${res.jobsFetched} | Inserted: ${res.jobsInserted} | Updated: ${res.jobsUpdated} | Expired: ${res.jobsExpired} | Rejected: ${res.jobsRejected}`);
    } catch (e: any) {
      console.error(`[${slug}] FAILED:`, e.message);
    }
  }

  console.log('\n==================================================');
  console.log('DATABASE SUMMARY');
  console.log('==================================================');
  const companies = await prisma.company.findMany({
    include: {
      jobs: { where: { status: 'ACTIVE' } }
    }
  });

  let totalActive = 0;
  for (const c of companies) {
    if (c.jobs.length > 0) {
      console.log(`✅ [LIVE] ${c.name} (${c.slug}): ${c.jobs.length} active jobs`);
      totalActive += c.jobs.length;
    } else {
      console.log(`ℹ️ [NOT_LIVE or 0 Roles] ${c.name} (${c.slug}): 0 active jobs`);
    }
  }
  console.log(`\nTOTAL ACTIVE EARLY-CAREER JOBS IN DATABASE: ${totalActive}`);

  await prisma.$disconnect();
}

runLiveSync().catch(console.error);
