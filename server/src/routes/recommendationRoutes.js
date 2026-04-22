import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', optionalAuth, asyncHandler(getRecommendations));

export default router;
