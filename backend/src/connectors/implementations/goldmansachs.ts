import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class GoldmanSachsConnector implements JobConnector {
  companyName = 'Goldman Sachs';
  companySlug = 'goldmansachs';
  careerPageUrl = 'https://www.goldmansachs.com/careers/';
  logoUrl = '/logos/goldmansachs.png';
  industry = 'Investment Banking & Financial Services';
  description = 'The Goldman Sachs Group, Inc. is a leading global financial institution that delivers a broad range of financial services.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[GoldmanSachsConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
