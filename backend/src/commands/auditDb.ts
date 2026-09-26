import { PrismaClient } from '@prisma/client';
import { connectorRegistry } from '../connectors/registry';

const prisma = new PrismaClient();

async function runAudit() {
  console.log('========================================');
  console.log('DATABASE INTEGRITY & CONSISTENCY AUDIT');
  console.log('========================================');

  const totalActive = await prisma.job.count({ where: { status: 'ACTIVE' } });
  const totalExpired = await prisma.job.count({ where: { status: 'EXPIRED' } });
  const totalRemoved = await prisma.job.count({ where: { status: 'REMOVED' } });
  const totalJobs = await prisma.job.count();

  console.log(`ACTIVE Jobs: ${totalActive}`);
  console.log(`EXPIRED Jobs: ${totalExpired}`);
  console.log(`REMOVED Jobs: ${totalRemoved}`);
  console.log(`TOTAL Jobs in DB: ${totalJobs}`);
  console.log('----------------------------------------');

  // Jobs per company and by connector mode
  const companies = await prisma.company.findMany({
    include: {
      jobs: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  console.log('\nJOBS PER COMPANY:');
  let activeFromLiveApi = 0;
  let activeFromBlocked = 0;

  for (const comp of companies) {
    const activeCount = comp.jobs.filter(j => j.status === 'ACTIVE').length;
    const expiredCount = comp.jobs.filter(j => j.status === 'EXPIRED').length;
    const connector = connectorRegistry.getConnector(comp.slug);
    const mode = (connector as any)?.mode || 'UNKNOWN';

    if (mode === 'DIRECT_API') {
      activeFromLiveApi += activeCount;
    } else {
      activeFromBlocked += activeCount;
    }

    console.log(`- ${comp.name} (${comp.slug}) [Mode: ${mode}]: Active = ${activeCount}, Expired = ${expiredCount}, Total = ${comp.jobs.length}`);
  }

  console.log('----------------------------------------');
  console.log(`Active Jobs from DIRECT_API (LIVE) Companies: ${activeFromLiveApi}`);
  console.log(`Active Jobs from NON-LIVE (SOURCE_BLOCKED/UNAVAILABLE) Companies: ${activeFromBlocked}`);
  console.log('----------------------------------------');

  // Check for duplicate externalJobIds per company
  const duplicates = await prisma.$queryRaw<Array<{ companyId: string; externalJobId: string; count: bigint }>>`
    SELECT "companyId", "externalJobId", COUNT(*) as count 
    FROM jobs 
    GROUP BY "companyId", "externalJobId" 
    HAVING COUNT(*) > 1
  `;
  console.log(`Duplicate externalJobIds per company: ${duplicates.length}`);

  // Missing fields
  const missingSourceUrl = await prisma.job.count({
    where: { sourceUrl: '' }
  });
  const missingExternalJobId = await prisma.job.count({
    where: { externalJobId: '' }
  });
  
  console.log(`Jobs missing sourceUrl (applyUrl): ${missingSourceUrl}`);
  console.log(`Jobs missing externalJobId: ${missingExternalJobId}`);

  // Experience requirement check: 0-1 YOE requirement
  const outsideYOE = await prisma.job.findMany({
    where: {
      OR: [
        { experienceMin: { gt: 1 } },
        { experienceMax: { gt: 2 } },
        { experienceMin: { lt: 0 } }
      ]
    },
    select: { id: true, title: true, experienceMin: true, experienceMax: true, companyId: true }
  });
  console.log(`Jobs outside 0-1 YOE requirement: ${outsideYOE.length}`);

  await prisma.$disconnect();
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
