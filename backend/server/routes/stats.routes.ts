import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const statsController = new StatsController();

router.get('/dashboard', authenticate, statsController.getDashboardStats);

export default router;