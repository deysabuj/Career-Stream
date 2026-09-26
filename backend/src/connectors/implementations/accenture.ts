import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { WorkdayProvider, WorkdayConfig } from '../providers/workday.js';

export class AccentureConnector implements JobConnector {
  companyName = 'Accenture';
  companySlug = 'accenture';
  careerPageUrl = 'https://accenture.wd103.myworkdayjobs.com/AccentureCareers';
  logoUrl = '/logos/accenture.png';
  industry = 'IT Services & Professional Consulting';
  description = 'Accenture plc is a professional services company specializing in IT services and management consulting.';

  private readonly workdayConfig: WorkdayConfig = {
    companyName: 'Accenture',
    host: 'accenture.wd103.myworkdayjobs.com',
    tenant: 'accenture',
    site: 'AccentureCareers',
    defaultCategory: 'IT Services & Professional Consulting',
    defaultSkills: ['Cloud Architecture', 'Python', 'Java', 'Consulting', 'Data Engineering', 'Agile'],
    limit: 20,
    requestTimeoutMs: 8000,
    detailTimeoutMs: 5000,
  };

  private readonly provider = new WorkdayProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[AccentureConnector] Initiating live job fetch via WorkdayProvider...');
    return await this.provider.fetchWorkdayJobs(this.workdayConfig);
  }
}
