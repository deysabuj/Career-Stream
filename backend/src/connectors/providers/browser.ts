import { chromium, Browser, Page } from 'playwright';
import { RawJob } from '../../types/index.js';
import { CompanyBrowserConfig } from '../browserConfigs/types.js';
import { SecurityDetector } from '../securityDetector.js';

export class SecurityChallengeError extends Error {
  public challengeType: string;

  constructor(challengeType: string, reason: string) {
    super(reason);
    this.name = 'SecurityChallengeError';
    this.challengeType = challengeType;
  }
}

export class BrowserProvider {
  /**
   * Fetches job listings via Playwright Chromium browser execution.
   */
  public async fetchBrowserJobs(config: CompanyBrowserConfig): Promise<RawJob[]> {
    console.log(`[BrowserProvider] Navigating to ${config.companyName} public career portal: ${config.careerPageUrl}...`);
    let browser: Browser | null = null;
    const jobs: RawJob[] = [];

    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });

      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        locale: 'en-US'
      });

      const page: Page = await context.newPage();

      let responseStatus = 200;
      page.on('response', (res) => {
        if (res.url() === config.careerPageUrl) {
          responseStatus = res.status();
        }
      });

      await page.goto(config.careerPageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);

      const html = await page.content();
      const title = await page.title();

      // Security check
      const secCheck = SecurityDetector.detect(html, title, responseStatus);
      if (secCheck.isSecurityChallenge) {
        console.warn(`[BrowserProvider] Security challenge detected on ${config.companyName}: ${secCheck.reason}`);
        throw new SecurityChallengeError(secCheck.challengeType || 'SOURCE_BLOCKED', secCheck.reason || 'Security barrier detected.');
      }

      // Check for structured JSON-LD JobPosting data
      const jsonLdElements = await page.$$eval('script[type="application/ld+json"]', (els) =>
        els.map((el) => el.textContent).filter(Boolean)
      );

      for (const text of jsonLdElements) {
        try {
          const parsed = JSON.parse(text!);
          const items = Array.isArray(parsed) ? parsed : [parsed];

          for (const item of items) {
            if (item['@type'] === 'JobPosting') {
              const jobId = String(item.identifier?.value || item.jobImmediateStart || item.url || `${config.companySlug}-${jobs.length + 1}`);
              jobs.push({
                externalJobId: jobId,
                title: item.title || 'Untitled Role',
                companyName: config.companyName,
                description: item.description || 'No description provided.',
                location: item.jobLocation?.address?.addressLocality || item.jobLocation?.address?.addressCountry || 'Multiple Locations',
                workMode: 'ONSITE',
                employmentType: item.employmentType || 'FULL_TIME',
                experienceText: item.experienceRequirements || 'Not specified',
                category: item.occupationalCategory || 'General',
                skills: [],
                sourceUrl: item.url || config.careerPageUrl,
                postedAt: item.datePosted ? new Date(item.datePosted) : new Date(),
              });
            }
          }
        } catch (_) {}
      }

      // If custom selectors provided and no JSON-LD found
      if (jobs.length === 0 && config.jobCardSelector) {
        const cards = await page.$$(config.jobCardSelector);
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const title = config.titleSelector ? (await card.$eval(config.titleSelector, el => el.textContent?.trim()).catch(() => '')) || 'Untitled Role' : 'Untitled Role';
          const location = config.locationSelector ? (await card.$eval(config.locationSelector, el => el.textContent?.trim()).catch(() => '')) || 'Multiple Locations' : 'Multiple Locations';
          const link = config.linkSelector ? (await card.$eval(config.linkSelector, el => (el as any).href).catch(() => config.careerPageUrl)) : config.careerPageUrl;

          jobs.push({
            externalJobId: `${config.companySlug}-browser-${i + 1}`,
            title,
            companyName: config.companyName,
            description: `Public job listing extracted from ${config.companyName} portal.`,
            location,
            workMode: 'ONSITE',
            employmentType: 'FULL_TIME',
            experienceText: 'Not specified',
            category: 'General',
            skills: [],
            sourceUrl: link,
            postedAt: new Date(),
          });
        }
      }

      console.log(`[BrowserProvider] Successfully extracted ${jobs.length} jobs via Playwright for ${config.companyName}.`);
      return jobs;
    } catch (err: any) {
      if (err instanceof SecurityChallengeError) {
        throw err;
      }
      console.error(`[BrowserProvider] Error executing browser fetch for ${config.companyName}:`, err.message);
      throw err;
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  }
}
