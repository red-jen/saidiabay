import { Request, Response, NextFunction } from 'express';
import { HeroClickService } from '../services/heroClick.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const heroClickService = new HeroClickService();

export class HeroClickController {
  /**
   * Track a hero click
   */
  async trackClick(req: Request, res: Response, next: NextFunction) {
    try {
      const { heroId, visitorId, userId } = req.body;

      if (!heroId || !visitorId) {
        return res.status(400).json({
          success: false,
          message: 'heroId and visitorId are required',
        });
      }

      const counted = await heroClickService.trackClick(heroId, visitorId, userId);

      res.json({
        success: true,
        counted, // true if click was counted, false if duplicate
        message: counted ? 'Click tracked' : 'Already clicked today',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all hero statistics
   */
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await heroClickService.getHeroStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get monthly clicks for a hero
   */
  async getMonthlyClicks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { heroId } = req.params;
      const { year, month } = req.query;

      let clicks: number;

      if (year && month) {
        clicks = await heroClickService.getMonthlyClicks(
          heroId,
          parseInt(year as string),
          parseInt(month as string)
        );
      } else {
        clicks = await heroClickService.getCurrentMonthClicks(heroId);
      }

      res.json({
        success: true,
        data: {
          heroId,
          clicks,
          year: year || new Date().getFullYear(),
          month: month || new Date().getMonth() + 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get total clicks for a hero
   */
  async getTotalClicks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { heroId } = req.params;
      const clicks = await heroClickService.getTotalClicks(heroId);

      res.json({
        success: true,
        data: {
          heroId,
          totalClicks: clicks,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
