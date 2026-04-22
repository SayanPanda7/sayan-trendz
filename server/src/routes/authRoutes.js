import { Router } from 'express';
import { getCurrentUser, syncUser, updateCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/sync', authenticate, asyncHandler(syncUser));
router.get('/me', authenticate, asyncHandler(getCurrentUser));
router.patch('/me', authenticate, asyncHandler(updateCurrentUser));

export default router;
