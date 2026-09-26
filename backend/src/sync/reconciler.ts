import { prisma } from '../database/db.js';
import { connectorRegistry } from '../connectors/registry.js';
import { ExperienceFilter } from './filter.js';
import { JobNormalizer } from './normalizer.js';
import { JobStatus } from '@prisma/client';
import { SecurityChallengeError } from '../connectors/providers/browser.js';

export interface SyncRunResult {
  companyName: string;
  jobsFetched: number;
  jobsInserted: number;
  jobsUpdated: number;
  jobsExpired: number;
  jobsRejected: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SOURCE_BLOCKED' | 'SOURCE_UNAVAILABLE';
  errorMessage?: string;
}

export class SyncEngine {
  /**
   * Run sync cycle for all registered company connectors
   */
  public async syncAll(): Promise<SyncRunResult[]> {
    const connectors = connectorRegistry.getAllConnectors();
    const results: SyncRunResult[] = [];

    for (const connector of connectors) {
      try {
        const res = await this.syncCompany(connector.companySlug);
        results.push(res);
      } catch (err) {
        const status = err instanceof SecurityChallengeError ? 'SOURCE_BLOCKED' : 'FAILED';
        results.push({
          companyName: connector.companyName,
          jobsFetched: 0,
          jobsInserted: 0,
          jobsUpdated: 0,
          jobsExpired: 0,
          jobsRejected: 0,
          status,
          errorMessage: (err as Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Synchronize & reconcile a specific company connector by slug
   */
  public async syncCompany(companySlug: string): Promise<SyncRunResult> {
    const connector = connectorRegistry.getConnector(companySlug);
    if (!connector) {
      throw new Error(`Connector for company slug '${companySlug}' not found.`);
    }

    const startedAt = new Date();
    let jobsFetched = 0;
    let jobsInserted = 0;
    let jobsUpdated = 0;
    let jobsExpired = 0;
    let jobsRejected = 0;

    try {
      // 1. Fetch raw jobs
      const rawJobs = await connector.fetchJobs();
      jobsFetched = rawJobs.length;

      // 2. Upsert Company in DB (if DB available)
      let dbCompany = null;
      try {
        dbCompany = await prisma.company.upsert({
          where: { slug: connector.companySlug },
          update: {
            name: connector.companyName,
            website: connector.careerPageUrl,
            careerUrl: connector.careerPageUrl,
            industry: connector.industry,
            description: connector.description,
            logoUrl: connector.logoUrl,
          },
          create: {
            name: connector.companyName,
            slug: connector.companySlug,
            website: connector.careerPageUrl,
            careerUrl: connector.careerPageUrl,
            industry: connector.industry,
            description: connector.description,
            logoUrl: connector.logoUrl,
          },
        });
      } catch (e) {
        console.warn(`[SyncEngine] DB Company upsert skipped or offline for ${connector.companyName}`);
      }

      const activeExternalIdsInFetch = new Set<string>();

      // 3. Process each fetched job
      for (const raw of rawJobs) {
        // Experience Filter check (0-1 YOE)
        if (!ExperienceFilter.isEligibleEarlyCareer(raw)) {
          jobsRejected++;
          continue;
        }

        const normalized = JobNormalizer.normalize(raw);
        activeExternalIdsInFetch.add(normalized.externalJobId);

        if (dbCompany) {
          try {
            const existingJob = await prisma.job.findUnique({
              where: {
                companyId_externalJobId: {
                  companyId: dbCompany.id,
                  externalJobId: normalized.externalJobId,
                },
              },
            });

            if (!existingJob) {
              // Insert new job
              await prisma.job.create({
                data: {
                  companyId: dbCompany.id,
                  externalJobId: normalized.externalJobId,
                  title: normalized.title,
                  description: normalized.description,
                  location: normalized.location,
                  workMode: normalized.workMode,
                  employmentType: normalized.employmentType,
                  experienceMin: normalized.experienceMin,
                  experienceMax: normalized.experienceMax,
                  category: normalized.category,
                  postedAt: normalized.postedAt,
                  deadline: normalized.deadline,
                  sourceUrl: normalized.sourceUrl,
                  contentHash: normalized.contentHash,
                  status: JobStatus.ACTIVE,
                  lastVerifiedAt: new Date(),
                },
              });
              jobsInserted++;
            } else {
              // Update existing job
              await prisma.job.update({
                where: { id: existingJob.id },
                data: {
                  title: normalized.title,
                  description: normalized.description,
                  location: normalized.location,
                  workMode: normalized.workMode,
                  employmentType: normalized.employmentType,
                  category: normalized.category,
                  sourceUrl: normalized.sourceUrl,
                  contentHash: normalized.contentHash,
                  status: JobStatus.ACTIVE,
                  lastVerifiedAt: new Date(),
                },
              });
              jobsUpdated++;
            }
          } catch (err) {
            console.error(`[SyncEngine] Error saving job ${normalized.externalJobId}:`, err);
          }
        }
      }

      // 4. Reconciliation: Expire jobs no longer present in official fetch ONLY if jobsFetched > 0
      if (dbCompany && jobsFetched > 0) {
        try {
          const activeDbJobs = await prisma.job.findMany({
            where: {
              companyId: dbCompany.id,
              status: JobStatus.ACTIVE,
            },
          });

          for (const dbJob of activeDbJobs) {
            if (!activeExternalIdsInFetch.has(dbJob.externalJobId)) {
              await prisma.job.update({
                where: { id: dbJob.id },
                data: { status: JobStatus.EXPIRED },
              });
              jobsExpired++;
            }
          }

          // Update active jobs count on Company
          const currentActiveCount = await prisma.job.count({
            where: { companyId: dbCompany.id, status: JobStatus.ACTIVE },
          });

          await prisma.company.update({
            where: { id: dbCompany.id },
            data: { activeJobsCount: currentActiveCount },
          });

          // Log SyncHistory record
          await prisma.syncHistory.create({
            data: {
              companyId: dbCompany.id,
              companyName: connector.companyName,
              status: 'SUCCESS',
              jobsFetched,
              jobsInserted,
              jobsUpdated,
              jobsExpired,
              jobsRejected,
              startedAt,
              completedAt: new Date(),
            },
          });
        } catch (e) {
          console.warn(`[SyncEngine] DB Reconciliation query failed:`, e);
        }
      }

      return {
        companyName: connector.companyName,
        jobsFetched,
        jobsInserted,
        jobsUpdated,
        jobsExpired,
        jobsRejected,
        status: 'SUCCESS',
      };
    } catch (error) {
      const isSecurity = error instanceof SecurityChallengeError;
      const status = isSecurity ? 'SOURCE_BLOCKED' : 'FAILED';
      const msg = (error as Error).message;

      return {
        companyName: connector.companyName,
        jobsFetched,
        jobsInserted,
        jobsUpdated,
        jobsExpired,
        jobsRejected,
        status,
        errorMessage: msg,
      };
    }
  }
}

export const syncEngine = new SyncEngine();
