import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { RecommendationService } from '../services/recommendation.service.js';

export class RecommendationsController {
  public static async getRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user ? req.user.userId : '';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;

      const jobs = await RecommendationService.getRecommendations(userId, limit);
      res.json({
        success: true,
        data: jobs,
      });
    } catch (err) {
      next(err);
    }
  }
}
