import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { GreenhouseProvider, GreenhouseConfig } from '../providers/greenhouse.js';

export class ZscalerConnector implements JobConnector {
  companyName = 'Zscaler';
  companySlug = 'zscaler';
  careerPageUrl = 'https://boards.greenhouse.io/zscaler';
  logoUrl = '/logos/zscaler.png';
  industry = 'Cloud Security & Zero Trust Architecture';
  description = 'Zscaler is a leader in cloud security, pioneering Zero Trust exchange platform protecting enterprise applications worldwide.';

  private readonly config: GreenhouseConfig = {
    companyName: 'Zscaler',
    boardToken: 'zscaler',
    defaultCategory: 'Cloud Security & Software Engineering',
    defaultSkills: ['C/C++', 'Python', 'Networking', 'Cybersecurity', 'Linux', 'Docker'],
  };

  private readonly provider = new GreenhouseProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[ZscalerConnector] Initiating live job fetch via GreenhouseProvider...');
    return await this.provider.fetchGreenhouseJobs(this.config);
  }
}
