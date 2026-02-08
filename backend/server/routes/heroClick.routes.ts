import { Router } from 'express';
import { HeroClickController } from '../controllers/heroClick.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const heroClickController = new HeroClickController();

/**
 * POST /api/hero-clicks/track
 * Track a hero click (public endpoint)
 */
router.post('/track', heroClickController.trackClick.bind(heroClickController));

/**
 * GET /api/hero-clicks/stats
 * Get all hero click statistics (admin only)
 */
router.get('/stats', authenticate, heroClickController.getStats.bind(heroClickController));

/**
 * GET /api/hero-clicks/:heroId/monthly
 * Get monthly clicks for a specific hero (admin only)
 */
router.get('/:heroId/monthly', authenticate, heroClickController.getMonthlyClicks.bind(heroClickController));

/**
 * GET /api/hero-clicks/:heroId/total
 * Get total clicks for a specific hero (admin only)
 */
router.get('/:heroId/total', authenticate, heroClickController.getTotalClicks.bind(heroClickController));

export default router;