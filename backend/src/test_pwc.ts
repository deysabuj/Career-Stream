import { PwCConnector } from './connectors/implementations/pwc.js';
import { SyncEngine } from './sync/reconciler.js';
import { prisma } from './database/db.js';

const engine = new SyncEngine();

async function testPwC() {
  console.log('--- TESTING PWC LIVE CONNECTOR ---');
  const connector = new PwCConnector();
  const rawJobs = await connector.fetchJobs();
  console.log(`Fetched ${rawJobs.length} raw jobs from PwC Workday.`);

  console.log('\nRunning full SyncEngine reconciliation for PwC...');
  const result = await engine.syncCompany('pwc');
  console.log('Sync Result:', result);

  const company = await prisma.company.findUnique({
    where: { slug: 'pwc' },
    include: { jobs: { where: { status: 'ACTIVE' } } }
  });
  console.log(`Database records for PwC: Total active jobs = ${company?.jobs.length}`);

  await prisma.$disconnect();
}

testPwC().catch(console.error);
