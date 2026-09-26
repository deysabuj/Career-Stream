import { CiscoConnector } from './connectors/implementations/cisco.js';
import { SyncEngine } from './sync/reconciler.js';
import { prisma } from './database/db.js';

const engine = new SyncEngine();

async function testCisco() {
  console.log('--- TESTING CISCO LIVE CONNECTOR ---');
  const connector = new CiscoConnector();
  const rawJobs = await connector.fetchJobs();
  console.log(`Fetched ${rawJobs.length} raw jobs from Cisco Workday.`);

  console.log('\nRunning full SyncEngine reconciliation for Cisco...');
  const result = await engine.syncCompany('cisco');
  console.log('Sync Result:', result);

  const company = await prisma.company.findUnique({
    where: { slug: 'cisco' },
    include: { jobs: { where: { status: 'ACTIVE' } } }
  });
  console.log(`Database records for Cisco: Total active jobs = ${company?.jobs.length}`);

  await prisma.$disconnect();
}

testCisco().catch(console.error);
