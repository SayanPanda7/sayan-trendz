import { Router } from 'express';
import { createCoupon, listCoupons, updateCoupon, validateCoupon } from '../controllers/couponController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/validate', authenticate, asyncHandler(validateCoupon));
router.get('/', authenticate, requireAdmin, asyncHandler(listCoupons));
router.post('/', authenticate, requireAdmin, asyncHandler(createCoupon));
router.patch('/:id', authenticate, requireAdmin, asyncHandler(updateCoupon));

export default router;
