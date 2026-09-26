import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class InfosysConnector implements JobConnector {
  companyName = 'Infosys';
  companySlug = 'infosys';
  careerPageUrl = 'https://www.infosys.com/careers/';
  logoUrl = '/logos/infosys.png';
  industry = 'IT Services & Business Consulting';
  description = 'Infosys Limited is an Indian multinational information technology company providing business consulting and IT services.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[InfosysConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
