import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class DeloitteConnector implements JobConnector {
  companyName = 'Deloitte';
  companySlug = 'deloitte';
  careerPageUrl = 'https://www.deloitte.com/careers';
  logoUrl = '/logos/deloitte.png';
  industry = 'Audit, Consulting & Financial Advisory';
  description = 'Deloitte is one of the Big Four accounting firms and the largest professional services network in the world.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[DeloitteConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
