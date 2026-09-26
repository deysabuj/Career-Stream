import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { WorkdayProvider, WorkdayConfig } from '../providers/workday.js';

export class NvidiaConnector implements JobConnector {
  companyName = 'NVIDIA';
  companySlug = 'nvidia';
  careerPageUrl = 'https://www.nvidia.com/en-us/about-nvidia/careers/';
  logoUrl = '/logos/nvidia.png';
  industry = 'Semiconductor & Hardware Tech';
  description = 'Pioneer of GPU accelerated computing, generative AI hardware, CUDA software, and autonomous systems.';

  private readonly workdayConfig: WorkdayConfig = {
    companyName: 'NVIDIA',
    host: 'nvidia.wd5.myworkdayjobs.com',
    tenant: 'nvidia',
    site: 'NVIDIAExternalCareerSite',
    workerSubTypes: [
      '0c40f6bd1d8f10adf6dae42e46d44a17', // Intern (Fixed Term)
      'ab40a98049581037a3ada55b087049b7', // New College Graduate
    ],
    defaultCategory: 'AI / Machine Learning',
    defaultSkills: ['CUDA', 'Python', 'C++', 'Deep Learning', 'GPU Infrastructure', 'PyTorch', 'System Architecture'],
    limit: 20,
    requestTimeoutMs: 8000,
    detailTimeoutMs: 5000,
  };

  private readonly provider = new WorkdayProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[NvidiaConnector] Initiating live job fetch via WorkdayProvider...');
    return await this.provider.fetchWorkdayJobs(this.workdayConfig);
  }
}
