import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class ManipalConnector implements JobConnector {
  companyName = 'Manipal Hospitals';
  companySlug = 'manipal';
  careerPageUrl = 'https://www.manipalhospitals.com/careers';
  logoUrl = '/logos/manipal.png';
  industry = 'Healthcare & Pharmaceuticals';
  description = 'Manipal Hospitals is one of India leading multi-specialty healthcare providers.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[ManipalConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
