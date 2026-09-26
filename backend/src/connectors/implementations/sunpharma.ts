import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class SunPharmaConnector implements JobConnector {
  companyName = 'Sun Pharma';
  companySlug = 'sunpharma';
  careerPageUrl = 'https://www.sunpharma.com/careers';
  logoUrl = '/logos/sunpharma.png';
  industry = 'Healthcare & Pharmaceuticals';
  description = 'Sun Pharmaceutical Industries Limited is an Indian multinational pharmaceutical company.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[SunPharmaConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
