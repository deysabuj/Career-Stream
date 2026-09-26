import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class IBMConnector implements JobConnector {
  companyName = 'IBM';
  companySlug = 'ibm';
  careerPageUrl = 'https://www.ibm.com/careers';
  logoUrl = '/logos/ibm.png';
  industry = 'Enterprise Cloud & Artificial Intelligence';
  description = 'International Business Machines Corporation is an American multinational technology corporation.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[IBMConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
