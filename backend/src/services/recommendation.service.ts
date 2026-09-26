import { prisma, isDBConnected } from '../database/db.js';
import { JobStatus } from '@prisma/client';
import { JobService } from './job.service.js';

export class RecommendationService {
  public static async getRecommendations(userId: string, limit = 6) {
    if (!isDBConnected) {
      const res = await JobService.getJobs({ page: 1, limit });
      return res.jobs;
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return this.getFallbackJobs(limit);
      }

      const skills = user.skills || [];
      const preferredRoles = user.preferredRoles || [];

      // Query ACTIVE jobs matching preferred roles or skills
      const jobs = await prisma.job.findMany({
        where: {
          status: JobStatus.ACTIVE,
          OR: [
            ...preferredRoles.map((role) => ({ title: { contains: role, mode: 'insensitive' as const } })),
            ...skills.map((skill) => ({ description: { contains: skill, mode: 'insensitive' as const } })),
          ],
        },
        include: {
          company: {
            select: { id: true, name: true, slug: true, logoUrl: true, industry: true },
          },
        },
        take: limit,
        orderBy: { postedAt: 'desc' },
      });

      if (jobs.length < limit) {
        const fallbacks = await this.getFallbackJobs(limit - jobs.length, jobs.map((j) => j.id));
        return [...jobs, ...fallbacks];
      }

      return jobs;
    } catch (e) {
      return this.getFallbackJobs(limit);
    }
  }

  private static async getFallbackJobs(limit: number, excludeIds: string[] = []) {
    if (!isDBConnected) {
      const res = await JobService.getJobs({ page: 1, limit });
      return res.jobs.filter(j => !excludeIds.includes(j.id));
    }

    try {
      return await prisma.job.findMany({
        where: {
          status: JobStatus.ACTIVE,
          id: { notIn: excludeIds },
        },
        include: {
          company: {
            select: { id: true, name: true, slug: true, logoUrl: true, industry: true },
          },
        },
        take: limit,
        orderBy: { postedAt: 'desc' },
      });
    } catch (e) {
      const res = await JobService.getJobs({ page: 1, limit });
      return res.jobs;
    }
  }
}
