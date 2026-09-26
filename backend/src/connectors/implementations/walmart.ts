import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class WalmartConnector implements JobConnector {
  companyName = 'Walmart Global Tech';
  companySlug = 'walmart';
  careerPageUrl = 'https://careers.walmart.com/';
  logoUrl = '/logos/walmart.png';
  industry = 'Retail Technology & E-commerce';
  description = 'Walmart Global Tech is the technology and software engineering arm of Walmart Inc.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[WalmartConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
