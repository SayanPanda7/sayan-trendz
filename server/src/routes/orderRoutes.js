import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  listOrders,
  updateOrderStatus,
  verifyRazorpayPayment,
} from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/', authenticate, asyncHandler(createOrder));
router.post('/verify-payment', authenticate, asyncHandler(verifyRazorpayPayment));
router.get('/my', authenticate, asyncHandler(getMyOrders));
router.get('/', authenticate, requireAdmin, asyncHandler(listOrders));
router.patch('/:id/status', authenticate, requireAdmin, asyncHandler(updateOrderStatus));

export default router;
