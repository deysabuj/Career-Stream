import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { WorkdayProvider, WorkdayConfig } from '../providers/workday.js';

export class PwCConnector implements JobConnector {
  companyName = 'PwC';
  companySlug = 'pwc';
  careerPageUrl = 'https://pwc.wd3.myworkdayjobs.com/Global_Experienced_Careers';
  logoUrl = '/logos/pwc.png';
  industry = 'Audit, Assurance & Consulting';
  description = 'PricewaterhouseCoopers is a global professional services network operating under the PwC brand.';

  private readonly workdayConfig: WorkdayConfig = {
    companyName: 'PwC',
    host: 'pwc.wd3.myworkdayjobs.com',
    tenant: 'pwc',
    site: 'Global_Experienced_Careers',
    defaultCategory: 'Audit, Assurance & Consulting',
    defaultSkills: ['Accounting', 'Audit', 'Tax', 'Consulting', 'Data Analytics', 'Risk Advisory'],
    limit: 20,
    requestTimeoutMs: 8000,
    detailTimeoutMs: 5000,
  };

  private readonly provider = new WorkdayProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[PwCConnector] Initiating live job fetch via WorkdayProvider...');
    return await this.provider.fetchWorkdayJobs(this.workdayConfig);
  }
}
