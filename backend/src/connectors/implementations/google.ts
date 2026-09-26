import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class GoogleConnector implements JobConnector {
  companyName = 'Google';
  companySlug = 'google';
  careerPageUrl = 'https://careers.google.com/jobs/results/';
  logoUrl = '/logos/google.png';
  industry = 'Technology & Cloud Services';
  description = 'Google LLC is an American multinational corporation specializing in internet-related services and products.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[GoogleConnector] Connector is NOT_LIVE (official portal requires non-automated auth). Returning 0 jobs.');
    return [];
  }
}
