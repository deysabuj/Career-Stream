import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { SavedJobService } from '../services/savedJob.service.js';

export class SavedJobsController {
  public static async saveJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id: jobId } = req.params;
      const userId = req.user!.userId;

      const result = await SavedJobService.saveJob(userId, jobId);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async removeSavedJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id: jobId } = req.params;
      const userId = req.user!.userId;

      await SavedJobService.removeSavedJob(userId, jobId);
      res.json({
        success: true,
        data: { message: 'Opportunity removed from saved list.' },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getSavedJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const jobs = await SavedJobService.getUserSavedJobs(userId);
      res.json({
        success: true,
        data: jobs,
      });
    } catch (err) {
      next(err);
    }
  }
}
