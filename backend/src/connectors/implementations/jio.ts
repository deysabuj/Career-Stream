import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class JioConnector implements JobConnector {
  companyName = 'Reliance Jio Platforms';
  companySlug = 'jio';
  careerPageUrl = 'https://careers.jio.com/';
  logoUrl = '/logos/jio.png';
  industry = 'Telecommunications & Digital Services';
  description = 'Jio Platforms is an Indian technology company and a subsidiary of Reliance Industries.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[JioConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
