import { prisma } from '../database/db.js';

export class SavedJobService {
  public static async saveJob(userId: string, jobId: string) {
    try {
      const existing = await prisma.savedJob.findUnique({
        where: {
          userId_jobId: { userId, jobId },
        },
      });

      if (existing) {
        return existing;
      }

      return await prisma.savedJob.create({
        data: { userId, jobId },
      });
    } catch (e) {
      throw new Error('Could not save job opportunity.');
    }
  }

  public static async removeSavedJob(userId: string, jobId: string) {
    try {
      await prisma.savedJob.deleteMany({
        where: { userId, jobId },
      });
      return { success: true };
    } catch (e) {
      throw new Error('Could not remove saved job.');
    }
  }

  public static async getUserSavedJobs(userId: string) {
    try {
      const saved = await prisma.savedJob.findMany({
        where: { userId },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logoUrl: true,
                  industry: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return saved.map((item) => item.job);
    } catch (e) {
      return [];
    }
  }
}
