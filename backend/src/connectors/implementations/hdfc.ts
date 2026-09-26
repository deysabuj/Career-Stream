import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class HDFCConnector implements JobConnector {
  companyName = 'HDFC Bank';
  companySlug = 'hdfc';
  careerPageUrl = 'https://www.hdfcbank.com/personal/about-us/careers';
  logoUrl = '/logos/hdfc.png';
  industry = 'Commercial Banking & Financial Technology';
  description = 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[HDFCConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
