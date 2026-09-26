import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class ConcentrixConnector implements JobConnector {
  companyName = 'Concentrix';
  companySlug = 'concentrix';
  careerPageUrl = 'https://jobs.concentrix.com/';
  logoUrl = '/logos/concentrix.png';
  industry = 'Customer Experience & Tech Solutions';
  description = 'Concentrix is a global technology and services leader providing customer experience (CX) solutions and technology transformation.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[ConcentrixConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
