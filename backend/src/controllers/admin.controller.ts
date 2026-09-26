import { Request, Response, NextFunction } from 'express';
import { syncEngine } from '../sync/reconciler.js';
import { connectorRegistry } from '../connectors/registry.js';
import { prisma } from '../database/db.js';

export class AdminController {
  public static async triggerSync(req: Request, res: Response, next: NextFunction) {
    try {
      const companySlug = req.query.company as string;
      if (companySlug) {
        const result = await syncEngine.syncCompany(companySlug);
        return res.json({
          success: true,
          data: [result],
        });
      }

      const results = await syncEngine.syncAll();
      res.json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getSyncStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const connectors = connectorRegistry.getAllConnectors();
      const connectorHealth = connectors.map((c) => ({
        companyName: c.companyName,
        companySlug: c.companySlug,
        careerPageUrl: c.careerPageUrl,
        status: 'HEALTHY',
      }));

      let history: any[] = [];
      try {
        history = await prisma.syncHistory.findMany({
          orderBy: { startedAt: 'desc' },
          take: 20,
        });
      } catch (e) {
        history = [];
      }

      res.json({
        success: true,
        data: {
          connectors: connectorHealth,
          recentSyncs: history,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
