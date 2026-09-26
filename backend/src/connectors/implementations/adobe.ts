import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { WorkdayProvider, WorkdayConfig } from '../providers/workday.js';

export class AdobeConnector implements JobConnector {
  companyName = 'Adobe';
  companySlug = 'adobe';
  careerPageUrl = 'https://adobe.wd5.myworkdayjobs.com/external_experienced';
  logoUrl = '/logos/adobe.png';
  industry = 'Creative Software & Digital Media';
  description = 'Adobe Inc. creates digital media, creative software tools like Photoshop and Illustrator, and enterprise experience cloud platforms.';

  private readonly workdayConfig: WorkdayConfig = {
    companyName: 'Adobe',
    host: 'adobe.wd5.myworkdayjobs.com',
    tenant: 'adobe',
    site: 'external_experienced',
    defaultCategory: 'Creative Software & Digital Media',
    defaultSkills: ['C++', 'JavaScript', 'React', 'UI Design', 'Cloud Systems', 'Python'],
    limit: 20,
    requestTimeoutMs: 8000,
    detailTimeoutMs: 5000,
  };

  private readonly provider = new WorkdayProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[AdobeConnector] Initiating live job fetch via WorkdayProvider...');
    return await this.provider.fetchWorkdayJobs(this.workdayConfig);
  }
}

