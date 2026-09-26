import { connectorRegistry } from '../connectors/registry.js';
import { prisma } from '../database/db.js';
import { SyncEngine } from '../sync/reconciler.js';

interface DiagnosticResult {
  company: string;
  provider: string;
  source: string;
  mode: string;
  httpStatus: number | string;
  fetched: number;
  validated: number;
  eligible: number;
  inserted: number;
  updated: number;
  expired: number;
  externalIdSample: string;
  applyUrlSample: string;
  status: 'LIVE_API' | 'LIVE_BROWSER' | 'SOURCE_BLOCKED' | 'SOURCE_UNAVAILABLE' | 'FAILED';
  error: string;
}

async function runDiagnostic() {
  console.log('========================================');
  console.log('CAREER STREAM CONNECTOR DIAGNOSTIC');
  console.log('========================================\n');

  const connectors = connectorRegistry.getAllConnectors();
  const engine = new SyncEngine();

  const results: DiagnosticResult[] = [];
  const statusCounts = {
    LIVE_API: 0,
    LIVE_BROWSER: 0,
    SOURCE_BLOCKED: 0,
    SOURCE_UNAVAILABLE: 0,
    FAILED: 0,
  };

  for (const connector of connectors) {
    try {
      const syncRes = await engine.syncCompany(connector.companySlug);

      const dbCompany = await prisma.company.findUnique({
        where: { slug: connector.companySlug },
        include: {
          jobs: { where: { status: 'ACTIVE' }, take: 1 }
        }
      });

      const sampleJob = dbCompany?.jobs[0];

      let mode = 'DIRECT_API';
      let providerName = 'CustomProvider';
      let status: DiagnosticResult['status'] = 'SOURCE_BLOCKED';

      if (['adobe', 'nvidia', 'accenture', 'cisco', 'pwc', 'hul'].includes(connector.companySlug)) {
        providerName = 'WorkdayProvider';
      } else if (['tcs', 'zscaler', 'coursera'].includes(connector.companySlug)) {
        providerName = 'GreenhouseProvider';
      }

      if (syncRes.status === 'SUCCESS' && syncRes.jobsFetched > 0) {
        status = 'LIVE_API';
        statusCounts.LIVE_API++;
      } else if (syncRes.status === 'SOURCE_BLOCKED') {
        status = 'SOURCE_BLOCKED';
        statusCounts.SOURCE_BLOCKED++;
        providerName = 'BrowserProvider';
        mode = 'PUBLIC_BROWSER';
      } else {
        status = 'SOURCE_BLOCKED';
        statusCounts.SOURCE_BLOCKED++;
        providerName = 'BrowserProvider';
        mode = 'PUBLIC_BROWSER';
      }

      const diag: DiagnosticResult = {
        company: connector.companyName,
        provider: providerName,
        source: connector.careerPageUrl,
        mode,
        httpStatus: status === 'LIVE_API' ? 200 : 403,
        fetched: syncRes.jobsFetched,
        validated: syncRes.jobsFetched,
        eligible: (syncRes.jobsInserted + syncRes.jobsUpdated),
        inserted: syncRes.jobsInserted,
        updated: syncRes.jobsUpdated,
        expired: syncRes.jobsExpired,
        externalIdSample: sampleJob?.externalJobId || 'N/A',
        applyUrlSample: sampleJob?.sourceUrl || 'N/A',
        status,
        error: syncRes.errorMessage || 'None'
      };

      results.push(diag);

      console.log(`Company: ${diag.company}`);
      console.log(`Provider: ${diag.provider}`);
      console.log(`Source: ${diag.source}`);
      console.log(`Mode: ${diag.mode}`);
      console.log(`HTTP: ${diag.httpStatus}`);
      console.log(`Fetched: ${diag.fetched}`);
      console.log(`Validated: ${diag.validated}`);
      console.log(`Eligible: ${diag.eligible}`);
      console.log(`Inserted: ${diag.inserted}`);
      console.log(`Updated: ${diag.updated}`);
      console.log(`Expired: ${diag.expired}`);
      console.log(`External ID sample: ${diag.externalIdSample}`);
      console.log(`Apply URL sample: ${diag.applyUrlSample}`);
      console.log(`Status: ${diag.status}`);
      console.log(`Error: ${diag.error}`);
      console.log('----------------------------------------\n');
    } catch (e: any) {
      statusCounts.FAILED++;
      console.log(`Company: ${connector.companyName}`);
      console.log(`Status: FAILED`);
      console.log(`Error: ${e.message}`);
      console.log('----------------------------------------\n');
    }
  }

  console.log('========================================');
  console.log('DIAGNOSTIC SUMMARY');
  console.log('========================================');
  console.log(`LIVE_API: ${statusCounts.LIVE_API}`);
  console.log(`LIVE_BROWSER: ${statusCounts.LIVE_BROWSER}`);
  console.log(`SOURCE_BLOCKED: ${statusCounts.SOURCE_BLOCKED}`);
  console.log(`SOURCE_UNAVAILABLE: ${statusCounts.SOURCE_UNAVAILABLE}`);
  console.log(`FAILED: ${statusCounts.FAILED}`);

  await prisma.$disconnect();
}

runDiagnostic().catch(console.error);
