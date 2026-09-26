import { RawJob } from '../../types/index.js';
import { validateRawJob } from '../validation.js';

export interface WorkdayConfig {
  companyName: string;
  host: string; // e.g. nvidia.wd5.myworkdayjobs.com
  tenant: string; // e.g. nvidia
  site: string; // e.g. NVIDIAExternalCareerSite
  workerSubTypes?: string[];
  defaultCategory?: string;
  defaultSkills?: string[];
  limit?: number;
  requestTimeoutMs?: number;
  detailTimeoutMs?: number;
}

export interface WorkdayJobPosting {
  title: string;
  externalPath: string;
  locationsText?: string;
  postedOn?: string;
  bulletFields?: string[];
}

export interface WorkdayJobPostingInfo {
  jobReqId?: string;
  title?: string;
  jobDescription?: string;
  location?: string;
  startDate?: string;
  externalUrl?: string;
}

export class WorkdayProvider {
  /**
   * Helper utility to safely strip HTML tags from description strings
   */
  public static stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Constructs the REST API search URL for a given Workday configuration
   */
  public static buildSearchUrl(config: WorkdayConfig): string {
    return `https://${config.host}/wday/cxs/${config.tenant}/${config.site}/jobs`;
  }

  /**
   * Constructs the REST API detail URL base
   */
  public static buildDetailBaseUrl(config: WorkdayConfig): string {
    return `https://${config.host}/wday/cxs/${config.tenant}/${config.site}`;
  }

  /**
   * Constructs the public candidate application URL base
   */
  public static buildPublicJobBaseUrl(config: WorkdayConfig): string {
    return `https://${config.host}/en-US/${config.site}`;
  }

  /**
   * Parses a Workday JSON job posting + detail record into a RawJob
   */
  public static parseWorkdayPosting(
    posting: WorkdayJobPosting,
    detailInfo: WorkdayJobPostingInfo | null,
    config: WorkdayConfig
  ): RawJob | null {
    const reqId = posting.bulletFields?.[0] || posting.externalPath.split('_').pop() || '';
    if (!reqId) return null;

    let description = detailInfo?.jobDescription
      ? this.stripHtml(detailInfo.jobDescription)
      : `Opportunity for ${posting.title} at ${config.companyName}. Location: ${posting.locationsText || 'Global'}.`;

    let postedAt: string | undefined = undefined;
    if (detailInfo?.startDate) {
      postedAt = new Date(detailInfo.startDate).toISOString();
    }

    const publicApplyUrl = detailInfo?.externalUrl || `${this.buildPublicJobBaseUrl(config)}${posting.externalPath}`;
    const location = detailInfo?.location || posting.locationsText || 'Location Unspecified';

    const candidate: RawJob = {
      externalJobId: reqId,
      title: posting.title || `${config.companyName} Position`,
      companyName: config.companyName,
      description,
      location,
      workMode: location.toLowerCase().includes('remote') ? 'REMOTE' : 'HYBRID',
      employmentType: (posting.title || '').toLowerCase().includes('intern') ? 'INTERNSHIP' : 'FULL_TIME',
      experienceText: '0-1 Years / University & Early Career',
      skills: config.defaultSkills || ['Software Engineering', 'Problem Solving'],
      category: config.defaultCategory || 'Software Engineering',
      postedAt,
      sourceUrl: publicApplyUrl,
    };

    return validateRawJob(candidate);
  }

  /**
   * Executes a live fetch across a Workday career portal
   */
  public async fetchWorkdayJobs(config: WorkdayConfig): Promise<RawJob[]> {
    const searchUrl = WorkdayProvider.buildSearchUrl(config);
    const detailBaseUrl = WorkdayProvider.buildDetailBaseUrl(config);
    const timeout = config.requestTimeoutMs || 8000;
    const detailTimeout = config.detailTimeoutMs || 5000;
    const rawJobs: RawJob[] = [];

    console.log(`[WorkdayProvider] Fetching jobs for ${config.companyName} from ${searchUrl}...`);

    try {
      const searchRes = await this.retryRequest(() =>
        fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          body: JSON.stringify({
            appliedFacets: config.workerSubTypes ? { workerSubType: config.workerSubTypes } : {},
            limit: config.limit || 20,
            offset: 0,
            searchText: '',
          }),
          signal: AbortSignal.timeout(timeout),
        })
      );

      if (!searchRes.ok) {
        throw new Error(`Workday API (${config.companyName}) returned HTTP status ${searchRes.status}`);
      }

      const data: any = await searchRes.json();
      const jobPostings: WorkdayJobPosting[] = data?.jobPostings || [];
      console.log(`[WorkdayProvider] ${config.companyName} returned ${jobPostings.length} job postings.`);

      for (const posting of jobPostings) {
        try {
          let detailInfo: WorkdayJobPostingInfo | null = null;
          const fullJobPath = `${detailBaseUrl}${posting.externalPath}`;

          try {
            const detailRes = await fetch(fullJobPath, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              },
              signal: AbortSignal.timeout(detailTimeout),
            });
            if (detailRes.ok) {
              const detailData: any = await detailRes.json();
              detailInfo = detailData?.jobPostingInfo || null;
            }
          } catch (e) {
            // Graceful fallback to summary object if detail fetch times out
          }

          const rawJob = WorkdayProvider.parseWorkdayPosting(posting, detailInfo, config);
          if (rawJob) {
            rawJobs.push(rawJob);
          }
        } catch (itemErr) {
          console.warn(`[WorkdayProvider] Error parsing item for ${config.companyName}:`, (itemErr as Error).message);
        }
      }
    } catch (err) {
      console.error(`[WorkdayProvider] Error in fetchWorkdayJobs for ${config.companyName}:`, (err as Error).message);
      return [];
    }

    console.log(`[WorkdayProvider] Successfully fetched & validated ${rawJobs.length} jobs for ${config.companyName}.`);
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
