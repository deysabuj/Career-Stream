import { RawJob } from '../../types/index.js';
import { validateRawJob } from '../validation.js';

export interface CustomApiConfig {
  companyName: string;
  endpointUrl: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
  requestTimeoutMs?: number;
  transformResponse: (data: any) => Array<{
    externalJobId: string;
    title: string;
    description: string;
    location?: string;
    workMode?: 'REMOTE' | 'HYBRID' | 'ON_SITE';
    employmentType?: 'FULL_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'PART_TIME';
    experienceText?: string;
    skills?: string[];
    category?: string;
    postedAt?: string;
    sourceUrl: string;
  }>;
}

export class CustomProvider {
  /**
   * Safely strip HTML tags
   */
  public static stripHtml(html?: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Executes a custom API fetch and normalizes output into validated RawJob[]
   */
  public async fetchCustomJobs(config: CustomApiConfig): Promise<RawJob[]> {
    const timeout = config.requestTimeoutMs || 8000;
    const rawJobs: RawJob[] = [];

    console.log(`[CustomProvider] Fetching jobs for ${config.companyName} from ${config.endpointUrl}...`);

    try {
      const res = await this.retryRequest(() =>
        fetch(config.endpointUrl, {
          method: config.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ...config.headers,
          },
          body: config.body ? JSON.stringify(config.body) : undefined,
          signal: AbortSignal.timeout(timeout),
        })
      );

      if (!res.ok) {
        throw new Error(`Custom API (${config.companyName}) returned HTTP ${res.status}`);
      }

      const data: any = await res.json();
      const extractedList = config.transformResponse(data);

      console.log(`[CustomProvider] ${config.companyName} extracted ${extractedList.length} items.`);

      for (const item of extractedList) {
        try {
          if (!item.externalJobId || !item.title || !item.sourceUrl) continue;

          const candidate: RawJob = {
            externalJobId: item.externalJobId,
            title: item.title,
            companyName: config.companyName,
            description: CustomProvider.stripHtml(item.description) || `Position: ${item.title} at ${config.companyName}`,
            location: item.location || 'Location Unspecified',
            workMode: item.workMode || ((item.location || '').toLowerCase().includes('remote') ? 'REMOTE' : 'HYBRID'),
            employmentType: item.employmentType || (item.title.toLowerCase().includes('intern') ? 'INTERNSHIP' : 'FULL_TIME'),
            experienceText: item.experienceText || '0-1 Years / Early Career',
            skills: item.skills || ['Software Engineering'],
            category: item.category || 'Software Development',
            postedAt: item.postedAt,
            sourceUrl: item.sourceUrl,
          };

          const validated = validateRawJob(candidate);
          if (validated) {
            rawJobs.push(validated);
          }
        } catch (itemErr) {
          console.warn(`[CustomProvider] Error parsing item for ${config.companyName}:`, (itemErr as Error).message);
        }
      }
    } catch (err) {
      console.error(`[CustomProvider] Error in fetchCustomJobs for ${config.companyName}:`, (err as Error).message);
      return [];
    }

    console.log(`[CustomProvider] Successfully fetched & validated ${rawJobs.length} jobs for ${config.companyName}.`);
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
