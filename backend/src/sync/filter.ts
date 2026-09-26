import { RawJob } from '../types/index.js';

const REJECT_KEYWORDS = [
  'senior', 'sr.', 'sr ', 'lead', 'staff', 'principal', 'manager', 'director', 
  'architect', 'head of', 'vice president', 'vp ', '3+ years', '4+ years', 
  '5+ years', '7+ years', '10+ years'
];

const ACCEPT_KEYWORDS = [
  'intern', 'internship', 'trainee', 'graduate trainee', 'fresher', 'associate', 
  'entry-level', 'entry level', 'graduate', 'new graduate', 'new grad', 'campus', 
  'early career', '0-1 years', '0 years', '1 year', 'step intern', 'junior'
];

export class ExperienceFilter {
  /**
   * Strictly evaluates if a job listing is eligible for early career candidates (0-1 YOE).
   */
  public static isEligibleEarlyCareer(job: RawJob): boolean {
    const titleLower = job.title.toLowerCase();
    const descLower = job.description.toLowerCase();
    const expLower = (job.experienceText || '').toLowerCase();
    const typeLower = job.employmentType.toLowerCase();

    // 1. Rejection check for senior positions in title
    for (const kw of REJECT_KEYWORDS) {
      if (titleLower.includes(kw)) {
        return false;
      }
    }

    // 2. Direct positive signals for entry level / graduate / intern
    for (const kw of ACCEPT_KEYWORDS) {
      if (titleLower.includes(kw) || typeLower.includes(kw) || expLower.includes(kw)) {
        return true;
      }
    }

    // 3. Rejection check for description explicitly requiring 3+ or 5+ years experience
    if (
      descLower.includes('minimum 3 years') ||
      descLower.includes('minimum 5 years') ||
      descLower.includes('3-5 years') ||
      descLower.includes('5-7 years')
    ) {
      return false;
    }

    // 4. Default to true for general non-senior early career roles
    return true;
  }
}
