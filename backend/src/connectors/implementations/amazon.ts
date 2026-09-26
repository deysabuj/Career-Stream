import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';
import { CustomProvider, CustomApiConfig } from '../providers/custom.js';

export class AmazonConnector implements JobConnector {
  companyName = 'Amazon';
  companySlug = 'amazon';
  careerPageUrl = 'https://www.amazon.jobs/';
  logoUrl = '/logos/amazon.png';
  industry = 'E-commerce & AWS Cloud';
  description = 'Amazon is a global technology and e-commerce company focusing on AWS cloud, logistics, streaming, and hardware.';

  private readonly config: CustomApiConfig = {
    companyName: 'Amazon',
    endpointUrl: 'https://www.amazon.jobs/en/search.json?category[]=software-development&result_limit=20',
    transformResponse: (data: any) => {
      const jobs = data?.jobs || [];
      return jobs.map((item: any) => ({
        externalJobId: item.id_icims || item.id || '',
        title: item.title || 'Software Engineer',
        description: item.description || item.description_short || '',
        location: item.normalized_location || item.location || 'Location Unspecified',
        workMode: (item.location || '').toLowerCase().includes('remote') ? 'REMOTE' as const : 'HYBRID' as const,
        employmentType: (item.is_intern || item.job_schedule_type === 'internship' || (item.title || '').toLowerCase().includes('intern'))
          ? 'INTERNSHIP' as const
          : 'FULL_TIME' as const,
        experienceText: '0-1 Years / University & Graduate',
        skills: ['Java', 'C++', 'Python', 'AWS', 'Distributed Systems'],
        category: 'Software Development',
        postedAt: item.posted_date ? new Date(item.posted_date).toISOString() : undefined,
        sourceUrl: item.job_path ? `https://www.amazon.jobs${item.job_path}` : 'https://www.amazon.jobs/',
      }));
    },
  };

  private readonly provider = new CustomProvider();

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[AmazonConnector] Initiating live job fetch via CustomProvider (Amazon Jobs API)...');
    return await this.provider.fetchCustomJobs(this.config);
  }
}
