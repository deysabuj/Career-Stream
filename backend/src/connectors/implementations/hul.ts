import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { WorkdayProvider, WorkdayConfig } from '../providers/workday.js';

export class HULConnector implements JobConnector {
  companyName = 'Hindustan Unilever';
  companySlug = 'hul';
  careerPageUrl = 'https://unilever.wd3.myworkdayjobs.com/Unilever_Early_Careers';
  logoUrl = '/logos/hul.png';
  industry = 'FMCG & Consumer Goods';
  description = 'Hindustan Unilever Limited is India largest fast-moving consumer goods company.';

  private readonly workdayConfig: WorkdayConfig = {
    companyName: 'Hindustan Unilever',
    host: 'unilever.wd3.myworkdayjobs.com',
    tenant: 'unilever',
    site: 'Unilever_Early_Careers',
    defaultCategory: 'FMCG & Supply Chain Management',
    defaultSkills: ['Supply Chain', 'Marketing', 'Sales', 'Data Analytics', 'Operations', 'Finance'],
    limit: 20,
    requestTimeoutMs: 8000,
    detailTimeoutMs: 5000,
  };

  private readonly provider = new WorkdayProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[HULConnector] Initiating live job fetch via WorkdayProvider...');
    return await this.provider.fetchWorkdayJobs(this.workdayConfig);
  }
}
