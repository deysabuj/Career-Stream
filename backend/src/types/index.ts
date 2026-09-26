export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type EmploymentType = 'INTERNSHIP' | 'FULL_TIME' | 'GRADUATE_PROGRAM' | 'TRAINEE';
export type JobStatus = 'ACTIVE' | 'EXPIRED' | 'REMOVED';

export interface RawJob {
  externalJobId: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceText?: string;
  skills: string[];
  category: string;
  postedAt?: string | Date;
  deadline?: string | Date;
  sourceUrl: string;
}

export interface NormalizedJob {
  externalJobId: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceMin: number;
  experienceMax: number;
  skills: string[];
  category: string;
  postedAt: Date;
  deadline?: Date;
  sourceUrl: string;
  contentHash: string;
}

export interface ValidatedJob extends NormalizedJob {
  isEligibleEarlyCareer: boolean;
}

export interface JobFilterParams {
  search?: string;
  companyId?: string;
  companySlug?: string;
  category?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  experienceMin?: number;
  experienceMax?: number;
  location?: string;
  postedWithinDays?: number;
  skills?: string[];
  status?: JobStatus;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'relevance' | 'company';
}

export interface UserPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
