import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { UserService } from '../services/user.service.js';

export class UsersController {
  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await UserService.getProfile(req.user!.userId);
      res.json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateProfile(req.user!.userId, req.body);
      res.json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}
