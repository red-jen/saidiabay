import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const statsController = new StatsController();

router.get('/dashboard', authenticate, statsController.getDashboardStats);
router.get('/revenue', authenticate, requireAdmin, statsController.getMonthlyRevenue);

export default router;