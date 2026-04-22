import { Router } from 'express';
import { upload, uploadImage } from '../controllers/uploadController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/image', authenticate, requireAdmin, upload.single('image'), asyncHandler(uploadImage));

export default router;
