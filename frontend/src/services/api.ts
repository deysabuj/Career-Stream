import axios from 'axios';
import { Job, Company, User, JobFilterParams, ResumeMatch } from '../types';
import { INDUSTRIES, Industry, getIndustryBySlug } from '../constants/industries';
import { COMPANY_CONFIGS } from '../constants/companies';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cs_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Map COMPANY_CONFIGS dictionary into Company[] array for client fallback
const MOCK_COMPANIES: Company[] = Object.values(COMPANY_CONFIGS).map((cfg) => ({
  id: `comp-${cfg.slug}`,
  name: cfg.name,
  slug: cfg.slug,
  logoUrl: cfg.logo || `/logos/${cfg.slug}.png`,
  website: cfg.website,
  careerUrl: cfg.careerPage,
  industry: cfg.industry,
  description: cfg.description,
  activeJobsCount: 2,
}));

const MOCK_JOBS: Job[] = [
  {
    id: 'goog-swe-intern-blr-2026',
    companyId: 'comp-google',
    externalJobId: 'goog-swe-intern-blr-2026',
    title: 'Software Engineering Intern, Summer 2026',
    description: 'As a Software Engineering Intern at Google, you will work on core Google infrastructure, AI tools, and Web products. Write C++/Java/Python code and build scalable distributed systems.',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    employmentType: 'INTERNSHIP',
    experienceMin: 0,
    experienceMax: 1,
    category: 'Software Engineering',
    postedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    sourceUrl: 'https://careers.google.com/jobs/results/goog-swe-intern-blr-2026',
    status: 'ACTIVE',
    lastVerifiedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    company: MOCK_COMPANIES[0],
  },
  {
    id: 'nvda-ai-infra-intern-2026',
    companyId: 'comp-nvidia',
    externalJobId: 'nvda-ai-infra-intern-2026',
    title: 'Deep Learning & AI System Infrastructure Intern',
    description: 'Work on CUDA acceleration, Megatron-LM training frameworks, and GPU cluster topology optimization for next-gen AI supercomputers.',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    employmentType: 'INTERNSHIP',
    experienceMin: 0,
    experienceMax: 1,
    category: 'AI / Machine Learning',
    postedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    sourceUrl: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
    status: 'ACTIVE',
    lastVerifiedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    company: MOCK_COMPANIES.find(c => c.slug === 'nvidia') || MOCK_COMPANIES[0],
  },
  {
    id: 'gs-quant-analyst-intern-2026',
    companyId: 'comp-goldmansachs',
    externalJobId: 'gs-quant-analyst-intern-2026',
    title: 'Quantitative Risk & Analytics Analyst Intern',
    description: 'Develop pricing models, stress-testing algorithms, and automated risk engine metrics for global trading desks.',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    employmentType: 'INTERNSHIP',
    experienceMin: 0,
    experienceMax: 1,
    category: 'Investment Banking',
    postedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    sourceUrl: 'https://www.goldmansachs.com/careers',
    status: 'ACTIVE',
    lastVerifiedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    company: MOCK_COMPANIES.find(c => c.slug === 'goldmansachs') || MOCK_COMPANIES[0],
  },
  {
    id: 'jpm-sep-intern-2026',
    companyId: 'comp-jpmorgan',
    externalJobId: 'jpm-sep-intern-2026',
    title: 'Software Engineer Program (SEP) Intern - Summer 2026',
    description: 'Design algorithmic trading platforms, financial microservices, and distributed ledger technology using Java, C++, and React.',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    employmentType: 'INTERNSHIP',
    experienceMin: 0,
    experienceMax: 1,
    category: 'Software Engineering',
    postedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    sourceUrl: 'https://careers.jpmorgan.com/us/en/careers/job/jpm-sep-intern-2026',
    status: 'ACTIVE',
    lastVerifiedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    company: MOCK_COMPANIES.find(c => c.slug === 'jpmorgan') || MOCK_COMPANIES[0],
  },
  {
    id: 'wmt-data-analyst-intern-2026',
    companyId: 'comp-walmart',
    externalJobId: 'wmt-data-analyst-intern-2026',
    title: 'Supply Chain Data Analyst Intern',
    description: 'Optimize inventory forecast models and warehouse logistics algorithms using SQL, Python, and Tableau.',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    employmentType: 'INTERNSHIP',
    experienceMin: 0,
    experienceMax: 1,
    category: 'Data Analytics',
    postedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    sourceUrl: 'https://careers.walmart.com',
    status: 'ACTIVE',
    lastVerifiedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    company: MOCK_COMPANIES.find(c => c.slug === 'walmart') || MOCK_COMPANIES[0],
  },
];

export const jobsApi = {
  getJobs: async (params?: JobFilterParams): Promise<{ jobs: Job[]; meta: any }> => {
    try {
      const response = await apiClient.get('/jobs', { params });
      if (response.data?.data) {
        return {
          jobs: response.data.data,
          meta: response.data.meta || { total: response.data.data.length, page: 1, limit: 12, totalPages: 1 },
        };
      }
    } catch (e) {}

    let filtered = [...MOCK_JOBS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company.name.toLowerCase().includes(q) || j.category.toLowerCase().includes(q)
      );
    }
    if (params?.workMode) {
      filtered = filtered.filter((j) => j.workMode === params.workMode);
    }
    if (params?.employmentType) {
      filtered = filtered.filter((j) => j.employmentType === params.employmentType);
    }

    return {
      jobs: filtered,
      meta: { total: filtered.length, page: 1, limit: 12, totalPages: 1 },
    };
  },

  getJobById: async (id: string): Promise<Job> => {
    try {
      const response = await apiClient.get(`/jobs/${id}`);
      if (response.data?.data) return response.data.data;
    } catch (e) {}

    const job = MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];
    return job;
  },

  getResumeMatch: async (jobId: string): Promise<ResumeMatch> => {
    try {
      const response = await apiClient.get(`/jobs/${jobId}/resume-match`);
      if (response.data?.data) return response.data.data;
    } catch (e) {}

    return {
      matchPercentage: 92,
      matchedSkills: ['Python', 'SQL', 'Data Analytics'],
      missingSkills: ['CUDA', 'Distributed Systems'],
      suggestions: ['Highlight analytical projects demonstrating SQL modeling and Python algorithms.'],
      fitLevel: 'Strong Fit',
    };
  },
};

export const companiesApi = {
  getCompanies: async (params?: { search?: string; industry?: string; domain?: string }): Promise<Company[]> => {
    try {
      const res = await apiClient.get('/companies', { params });
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
    } catch (e) {}

    let list = MOCK_COMPANIES;
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    if (params?.industry) {
      const indQuery = params.industry.toLowerCase();
      list = list.filter((c) => c.industry.toLowerCase().includes(indQuery));
    }

    return list;
  },

  getCompanyBySlug: async (slug: string): Promise<Company> => {
    try {
      const res = await apiClient.get(`/companies/${slug}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const company = MOCK_COMPANIES.find((c) => c.slug === slug) || MOCK_COMPANIES[0];
    return {
      ...company,
      jobs: MOCK_JOBS.filter((j) => j.company.slug === company.slug),
    };
  },
};

export const industriesApi = {
  getIndustries: async (): Promise<Industry[]> => {
    try {
      const res = await apiClient.get('/industries');
      if (res.data?.data) return res.data.data;
    } catch (e) {}
    return INDUSTRIES;
  },

  getIndustryBySlug: async (slug: string): Promise<Industry | undefined> => {
    try {
      const res = await apiClient.get(`/industries/${slug}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {}
    return getIndustryBySlug(slug);
  }
};

export const userApi = {
  getSavedJobs: async (): Promise<Job[]> => {
    try {
      const res = await apiClient.get('/users/saved-jobs');
      if (res.data?.data) return res.data.data;
    } catch (e) {}

    const savedIds = JSON.parse(localStorage.getItem('cs_saved_jobs') || '[]');
    return MOCK_JOBS.filter((j) => savedIds.includes(j.id));
  },

  toggleSaveJob: async (jobId: string, isSaved: boolean): Promise<boolean> => {
    try {
      if (isSaved) {
        await apiClient.delete(`/jobs/${jobId}/save`);
      } else {
        await apiClient.post(`/jobs/${jobId}/save`);
      }
    } catch (e) {}

    const savedIds: string[] = JSON.parse(localStorage.getItem('cs_saved_jobs') || '[]');
    let updated: string[];
    if (isSaved) {
      updated = savedIds.filter((id) => id !== jobId);
    } else {
      updated = Array.from(new Set([...savedIds, jobId]));
    }
    localStorage.setItem('cs_saved_jobs', JSON.stringify(updated));
    return !isSaved;
  },

  getRecommendations: async (): Promise<Job[]> => {
    try {
      const res = await apiClient.get('/recommendations');
      if (res.data?.data) return res.data.data;
    } catch (e) {}
    return MOCK_JOBS;
  },
};
