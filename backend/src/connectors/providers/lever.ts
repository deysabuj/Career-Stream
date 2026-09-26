import { RawJob } from '../../types/index.js';
import { validateRawJob } from '../validation.js';

export interface LeverConfig {
  companyName: string;
  siteToken: string; // e.g. 'razorpay', 'delhivery'
  defaultCategory?: string;
  defaultSkills?: string[];
  requestTimeoutMs?: number;
}

export interface LeverJobPosting {
  id: string;
  text: string;
  createdAt?: number;
  hostedUrl?: string;
  applyUrl?: string;
  descriptionPlain?: string;
  description?: string;
  categories?: {
    location?: string;
    team?: string;
    commitment?: string;
  };
}

export class LeverProvider {
  /**
   * Safely strip HTML tags from description content
   */
  public static stripHtml(html?: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Fetches and normalizes public Lever jobs for a company
   */
  public async fetchLeverJobs(config: LeverConfig): Promise<RawJob[]> {
    const timeout = config.requestTimeoutMs || 8000;
    const url = `https://api.lever.co/v0/postings/${config.siteToken}?mode=json`;
    const rawJobs: RawJob[] = [];

    console.log(`[LeverProvider] Fetching jobs for ${config.companyName} from siteToken: ${config.siteToken}...`);

    try {
      const res = await this.retryRequest(() =>
        fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(timeout),
        })
      );

      if (!res.ok) {
        throw new Error(`Lever API (${config.siteToken}) returned HTTP ${res.status}`);
      }

      const postings = (await res.json()) as LeverJobPosting[];
      if (!Array.isArray(postings)) {
        throw new Error(`Lever API (${config.siteToken}) did not return an array`);
      }

      console.log(`[LeverProvider] ${config.companyName} returned ${postings.length} raw postings.`);

      for (const posting of postings) {
        try {
          const jobId = posting.id;
          if (!jobId) continue;

          const title = posting.text || `${config.companyName} Position`;
          const rawDescription = posting.descriptionPlain || (posting.description ? LeverProvider.stripHtml(posting.description) : '');
          const description = rawDescription.length > 30
            ? rawDescription
            : `Opportunity for ${title} at ${config.companyName}.`;

          const location = posting.categories?.location || 'Location Unspecified';
          const department = posting.categories?.team || config.defaultCategory || 'Software Engineering';
          const commitment = posting.categories?.commitment || '';

          const isInternship = title.toLowerCase().includes('intern') ||
            title.toLowerCase().includes('co-op') ||
            commitment.toLowerCase().includes('intern');

          const candidate: RawJob = {
            externalJobId: jobId,
            title,
            companyName: config.companyName,
            description,
            location,
            workMode: location.toLowerCase().includes('remote') ? 'REMOTE' : 'HYBRID',
            employmentType: isInternship ? 'INTERNSHIP' : 'FULL_TIME',
            experienceText: '0-1 Years / Early Career',
            skills: config.defaultSkills || ['Software Engineering', 'Problem Solving'],
            category: department,
            postedAt: posting.createdAt ? new Date(posting.createdAt).toISOString() : undefined,
            sourceUrl: posting.hostedUrl || `https://jobs.lever.co/${config.siteToken}/${jobId}`,
          };

          const validated = validateRawJob(candidate);
          if (validated) {
            rawJobs.push(validated);
          }
        } catch (itemErr) {
          console.warn(`[LeverProvider] Error parsing item for ${config.companyName}:`, (itemErr as Error).message);
        }
      }
    } catch (err) {
      console.error(`[LeverProvider] Error in fetchLeverJobs for ${config.companyName}:`, (err as Error).message);
      return [];
    }

    console.log(`[LeverProvider] Successfully fetched & validated ${rawJobs.length} jobs for ${config.companyName}.`);
    return rawJobs;
  }

  private async retryRequest<T>(fn: () => Promise<T>, retries = 2, delayMs = 1000): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise((res) => setTimeout(res, delayMs));
      return this.retryRequest(fn, retries - 1, delayMs * 2);
    }
  }
}
