import { Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const statsService = new StatsService();

export class StatsController {
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getDashboardStats();
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}