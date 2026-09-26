import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { WorkdayProvider, WorkdayConfig } from '../providers/workday.js';

export class CiscoConnector implements JobConnector {
  companyName = 'Cisco Systems';
  companySlug = 'cisco';
  careerPageUrl = 'https://cisco.wd5.myworkdayjobs.com/Cisco_Careers';
  logoUrl = '/logos/cisco.png';
  industry = 'Networking Hardware & Cybersecurity';
  description = 'Cisco Systems, Inc. is an American multinational technology conglomerate providing networking hardware and telecommunications equipment.';

  private readonly workdayConfig: WorkdayConfig = {
    companyName: 'Cisco Systems',
    host: 'cisco.wd5.myworkdayjobs.com',
    tenant: 'cisco',
    site: 'Cisco_Careers',
    defaultCategory: 'Software Engineering & Networking',
    defaultSkills: ['Networking', 'Python', 'C++', 'Cybersecurity', 'Cloud', 'Linux'],
    limit: 20,
    requestTimeoutMs: 8000,
    detailTimeoutMs: 5000,
  };

  private readonly provider = new WorkdayProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[CiscoConnector] Initiating live job fetch via WorkdayProvider...');
    return await this.provider.fetchWorkdayJobs(this.workdayConfig);
  }
}
