import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class TataMotorsConnector implements JobConnector {
  companyName = 'Tata Motors';
  companySlug = 'tatamotors';
  careerPageUrl = 'https://www.tatamotors.com/careers/';
  logoUrl = '/logos/tatamotors.png';
  industry = 'Automotive & Electric Vehicles';
  description = 'Tata Motors Limited is an Indian multinational automotive manufacturing company headquartered in Mumbai.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[TataMotorsConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
