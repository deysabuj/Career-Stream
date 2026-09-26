import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class KPMGConnector implements JobConnector {
  companyName = 'KPMG';
  companySlug = 'kpmg';
  careerPageUrl = 'https://home.kpmg/careers';
  logoUrl = '/logos/kpmg.png';
  industry = 'Audit, Tax & Advisory Services';
  description = 'KPMG is a multinational professional services network and one of the Big Four accounting organizations.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[KPMGConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
