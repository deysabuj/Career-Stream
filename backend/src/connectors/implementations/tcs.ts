import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { GreenhouseProvider, GreenhouseConfig } from '../providers/greenhouse.js';

export class TCSConnector implements JobConnector {
  companyName = 'Tata Consultancy Services';
  companySlug = 'tcs';
  careerPageUrl = 'https://boards.greenhouse.io/tcs';
  logoUrl = '/logos/tcs.png';
  industry = 'IT Services & Consulting';
  description = 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.';

  private readonly config: GreenhouseConfig = {
    companyName: 'Tata Consultancy Services',
    boardToken: 'tcs',
    defaultCategory: 'IT Services & Software Development',
    defaultSkills: ['Python', 'Java', 'React', 'Node.js', 'PostgreSQL', 'Cloud Computing'],
  };

  private readonly provider = new GreenhouseProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[TCSConnector] Initiating live job fetch via GreenhouseProvider...');
    return await this.provider.fetchGreenhouseJobs(this.config);
  }
}
