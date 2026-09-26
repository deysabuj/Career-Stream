import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class JPMorganConnector implements JobConnector {
  companyName = 'JPMorgan Chase & Co.';
  companySlug = 'jpmorgan';
  careerPageUrl = 'https://careers.jpmorganchase.com/';
  logoUrl = '/logos/jpmorgan.png';
  industry = 'Investment Banking & Financial Services';
  description = 'JPMorgan Chase & Co. is a global leader in financial services, offering solutions to corporations, governments and institutions.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[JPMorganConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
