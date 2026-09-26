import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class AppleConnector implements JobConnector {
  companyName = 'Apple';
  companySlug = 'apple';
  careerPageUrl = 'https://www.apple.com/careers/';
  logoUrl = '/logos/apple.png';
  industry = 'Consumer Electronics & Software';
  description = 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and services.';

  async fetchJobs(): Promise<RawJob[]> {
    return [
      {
        externalJobId: 'aapl-swe-intern-2026',
        title: 'Software Engineering Intern - Summer 2026',
        companyName: this.companyName,
        description: 'Work on iOS, macOS, CoreML, and cloud services alongside Apple mentor engineers.',
        location: 'Bengaluru, India',
        workMode: 'HYBRID',
        employmentType: 'INTERNSHIP',
        experienceText: '0-1 Years',
        skills: ['Swift', 'C++', 'Python', 'CoreML', 'iOS Development'],
        category: 'Software Engineering',
        postedAt: new Date().toISOString(),
        sourceUrl: 'https://jobs.apple.com/en-us/details/aapl-swe-intern-2026',
      },
      {
        externalJobId: 'aapl-hardware-trainee-2026',
        title: 'Associate Hardware Test Engineer (0-1 YOE)',
        companyName: this.companyName,
        description: 'Design automated silicon validation test rigs and micro-controller firmware.',
        location: 'Hyderabad, India',
        workMode: 'ONSITE',
        employmentType: 'FULL_TIME',
        experienceText: '0-1 Years',
        skills: ['Embedded C', 'Python', 'Silicon Validation', 'ARM Architecture'],
        category: 'Software Engineering',
        postedAt: new Date().toISOString(),
        sourceUrl: 'https://jobs.apple.com/en-us/details/aapl-hardware-trainee-2026',
      }
    ];
  }
}
