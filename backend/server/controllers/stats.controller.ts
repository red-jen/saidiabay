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

  async getMonthlyRevenue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { year, month } = req.query;

      if (!year || !month) {
        return res.status(400).json({
          success: false,
          message: 'Year and month are required'
        });
      }

      const revenue = await statsService.getMonthlyRevenue(
        Number(year),
        Number(month)
      );

      res.json({ success: true, data: { revenue } });
    } catch (error) {
      next(error);
    }
  }
}