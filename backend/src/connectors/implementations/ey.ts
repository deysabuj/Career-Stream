import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class EYConnector implements JobConnector {
  companyName = 'EY (Ernst & Young)';
  companySlug = 'ey';
  careerPageUrl = 'https://www.ey.com/careers';
  logoUrl = '/logos/ey.png';
  industry = 'Tax, Assurance & Advisory';
  description = 'Ernst & Young is a global leader in assurance, tax, transaction and advisory services.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[EYConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
