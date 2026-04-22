import { Router } from 'express';
import { getDashboard, trackEvent } from '../controllers/analyticsController.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/track', optionalAuth, asyncHandler(trackEvent));
router.get('/dashboard', authenticate, requireAdmin, asyncHandler(getDashboard));

export default router;
