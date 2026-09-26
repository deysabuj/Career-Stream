import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class DelhiveryConnector implements JobConnector {
  companyName = 'Delhivery';
  companySlug = 'delhivery';
  careerPageUrl = 'https://www.delhivery.com/careers';
  logoUrl = '/logos/delhivery.png';
  industry = 'Logistics & Supply Chain Tech';
  description = 'Delhivery Limited is an Indian logistics and supply chain services company.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[DelhiveryConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
