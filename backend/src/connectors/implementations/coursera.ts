import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { GreenhouseProvider, GreenhouseConfig } from '../providers/greenhouse.js';

export class CourseraConnector implements JobConnector {
  companyName = 'Coursera';
  companySlug = 'coursera';
  careerPageUrl = 'https://boards.greenhouse.io/coursera';
  logoUrl = '/logos/coursera.png';
  industry = 'EdTech & Online Education';
  description = 'Global online learning platform offering courses, certificates, and degrees from world-class universities and companies.';

  private readonly config: GreenhouseConfig = {
    companyName: 'Coursera',
    boardToken: 'coursera',
    defaultCategory: 'EdTech & Software Development',
    defaultSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'GraphQL'],
  };

  private readonly provider = new GreenhouseProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[CourseraConnector] Initiating live job fetch via GreenhouseProvider...');
    return await this.provider.fetchGreenhouseJobs(this.config);
  }
}
