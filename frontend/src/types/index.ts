export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type EmploymentType = 'INTERNSHIP' | 'FULL_TIME' | 'GRADUATE_PROGRAM' | 'TRAINEE';
export type JobStatus = 'ACTIVE' | 'EXPIRED' | 'REMOVED';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website: string;
  careerUrl: string;
  industry: string;
  description: string;
  activeJobsCount?: number;
  _count?: {
    jobs: number;
  };
  jobs?: Job[];
}

export interface JobSummary {
  overview: string;
  keyResponsibilities: string[];
  keyRequirements: string[];
  recommendedSkills: string[];
}

export interface Job {
  id: string;
  companyId: string;
  externalJobId: string;
  title: string;
  description: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceMin: number;
  experienceMax: number;
  category: string;
  postedAt: string;
  deadline?: string;
  sourceUrl: string;
  status: JobStatus;
  lastVerifiedAt: string;
  company: Company;
  aiSummary?: JobSummary;
}

export interface ResumeMatch {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  fitLevel: 'Strong Fit' | 'Moderate Fit' | 'Growth Opportunity';
}

export interface User {
  id: string;
  email: string;
  name: string;
  college?: string;
  degree?: string;
  branch?: string;
  gradYear?: number;
  skills: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  resumeUrl?: string;
  role: 'USER' | 'ADMIN';
}

export interface JobFilterParams {
  search?: string;
  company?: string;
  category?: string;
  workMode?: string;
  employmentType?: string;
  location?: string;
  postedWithinDays?: number;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'relevance';
}
