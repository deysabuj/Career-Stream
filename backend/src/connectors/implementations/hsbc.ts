import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class HSBCConnector implements JobConnector {
  companyName = 'HSBC';
  companySlug = 'hsbc';
  careerPageUrl = 'https://www.hsbc.com/careers';
  logoUrl = '/logos/hsbc.png';
  industry = 'Global Banking & Wealth Management';
  description = 'HSBC Holdings plc is a British universal bank and financial services holding company.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[HSBCConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
