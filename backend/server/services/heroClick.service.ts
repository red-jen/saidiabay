import { prisma } from '../config/database';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export class HeroClickService {
  /**
   * Track a hero click
   * Only counts 1 click per user per hero per day
   */
  async trackClick(heroId: string, visitorId: string, userId?: string): Promise<boolean> {
    try {
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      // Check if user already clicked this hero today
      const existingClick = await prisma.heroClick.findFirst({
        where: {
          heroId,
          visitorId,
          clickedAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      });

      // If already clicked today, don't count again
      if (existingClick) {
        return false; // Not counted
      }

      // Create new click record
      await prisma.heroClick.create({
        data: {
          heroId,
          visitorId,
          userId: userId || null,
        },
      });

      return true; // Counted
    } catch (error) {
      console.error('Error tracking hero click:', error);
      return false;
    }
  }

  /**
   * Get monthly click count for a hero
   */
  async getMonthlyClicks(heroId: string, year: number, month: number): Promise<number> {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const count = await prisma.heroClick.count({
      where: {
        heroId,
        clickedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return count;
  }

  /**
   * Get current month clicks for a hero
   */
  async getCurrentMonthClicks(heroId: string): Promise<number> {
    const now = new Date();
    return this.getMonthlyClicks(heroId, now.getFullYear(), now.getMonth() + 1);
  }

  /**
   * Get all-time clicks for a hero
   */
  async getTotalClicks(heroId: string): Promise<number> {
    const count = await prisma.heroClick.count({
      where: { heroId },
    });

    return count;
  }

  /**
   * Get click statistics for all heroes
   */
  async getHeroStats() {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const heroes = await prisma.heroSection.findMany({
      include: {
        _count: {
          select: {
            clicks: true, // Total clicks
          },
        },
      },
    });

    // Get monthly clicks for each hero
    const statsPromises = heroes.map(async (hero) => {
      const monthlyClicks = await prisma.heroClick.count({
        where: {
          heroId: hero.id,
          clickedAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      });

      return {
        heroId: hero.id,
        imageUrl: hero.imageUrl,
        ctaLink: hero.ctaLink,
        isActive: hero.isActive,
        totalClicks: hero._count.clicks,
        monthlyClicks,
      };
    });

    return Promise.all(statsPromises);
  }

  /**
   * Get click history for a hero (grouped by day)
   */
  async getClickHistory(heroId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const clicks = await prisma.heroClick.groupBy({
      by: ['clickedAt'],
      where: {
        heroId,
        clickedAt: {
          gte: startDate,
        },
      },
      _count: true,
    });

    return clicks;
  }

  /**
   * Clean up old click data (optional - for data management)
   */
  async cleanOldClicks(olderThanDays: number = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.heroClick.deleteMany({
      where: {
        clickedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}