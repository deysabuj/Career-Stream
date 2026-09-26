import { RawJob } from '../../types/index.js';
import { validateRawJob } from '../validation.js';

export interface GreenhouseConfig {
  companyName: string;
  boardToken: string; // e.g. 'coursera', 'zscaler', 'tcs'
  defaultCategory?: string;
  defaultSkills?: string[];
  requestTimeoutMs?: number;
}

export interface GreenhouseJobPosting {
  id: number | string;
  title: string;
  updated_at?: string;
  location?: {
    name?: string;
  };
  absolute_url?: string;
  content?: string;
  departments?: Array<{ name: string }>;
  offices?: Array<{ name: string; location?: string }>;
}

export class GreenhouseProvider {
  /**
   * Safely strip HTML tags from description content
   */
  public static stripHtml(html?: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Fetches and normalizes public Greenhouse jobs for a company
   */
  public async fetchGreenhouseJobs(config: GreenhouseConfig): Promise<RawJob[]> {
    const timeout = config.requestTimeoutMs || 8000;
    const url = `https://boards-api.greenhouse.io/v1/boards/${config.boardToken}/jobs?content=true`;
    const rawJobs: RawJob[] = [];

    console.log(`[GreenhouseProvider] Fetching jobs for ${config.companyName} from board: ${config.boardToken}...`);

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
        throw new Error(`Greenhouse API (${config.boardToken}) returned HTTP ${res.status}`);
      }

      const data: any = await res.json();
      const postings: GreenhouseJobPosting[] = data?.jobs || [];
      console.log(`[GreenhouseProvider] ${config.companyName} returned ${postings.length} raw postings.`);

      for (const posting of postings) {
        try {
          const jobId = String(posting.id || '');
          if (!jobId) continue;

          const title = posting.title || `${config.companyName} Position`;
          const rawDescription = posting.content ? GreenhouseProvider.stripHtml(posting.content) : '';
          const description = rawDescription.length > 30
            ? rawDescription
            : `Opportunity for ${title} at ${config.companyName}.`;

          const location = posting.location?.name || posting.offices?.[0]?.name || 'Location Unspecified';
          const department = posting.departments?.[0]?.name || config.defaultCategory || 'Software Engineering';

          const candidate: RawJob = {
            externalJobId: jobId,
            title,
            companyName: config.companyName,
            description,
            location,
            workMode: location.toLowerCase().includes('remote') ? 'REMOTE' : 'HYBRID',
            employmentType: title.toLowerCase().includes('intern') || title.toLowerCase().includes('co-op') ? 'INTERNSHIP' : 'FULL_TIME',
            experienceText: '0-1 Years / Early Career',
            skills: config.defaultSkills || ['Software Development', 'Problem Solving'],
            category: department,
            postedAt: posting.updated_at ? new Date(posting.updated_at).toISOString() : undefined,
            sourceUrl: posting.absolute_url || `https://boards.greenhouse.io/${config.boardToken}/jobs/${jobId}`,
          };

          const validated = validateRawJob(candidate);
          if (validated) {
            rawJobs.push(validated);
          }
        } catch (itemErr) {
          console.warn(`[GreenhouseProvider] Error parsing item for ${config.companyName}:`, (itemErr as Error).message);
        }
      }
    } catch (err) {
      console.error(`[GreenhouseProvider] Error in fetchGreenhouseJobs for ${config.companyName}:`, (err as Error).message);
      return [];
    }

    console.log(`[GreenhouseProvider] Successfully fetched & validated ${rawJobs.length} jobs for ${config.companyName}.`);
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
