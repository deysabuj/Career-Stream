import { RawJob } from '../types/index.js';

export interface JobConnector {
  companyName: string;
  companySlug: string;
  careerPageUrl: string;
  logoUrl: string;
  industry: string;
  description: string;
  
  fetchJobs(): Promise<RawJob[]>;
}
