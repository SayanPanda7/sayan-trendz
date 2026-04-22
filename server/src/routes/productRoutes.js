import { Router } from 'express';
import { createProduct, getProductBySlug, listProducts, updateProduct } from '../controllers/productController.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', optionalAuth, asyncHandler(listProducts));
router.get('/:slug', optionalAuth, asyncHandler(getProductBySlug));
router.post('/', authenticate, requireAdmin, asyncHandler(createProduct));
router.patch('/:id', authenticate, requireAdmin, asyncHandler(updateProduct));

export default router;
