import { Router } from 'express';
import { getProfile, createOrUpdateProfile, getMyRecommendations } from '../controller/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', requireAuth as any, getProfile);
router.post('/profile', requireAuth as any, createOrUpdateProfile);
router.get('/recommendations', requireAuth as any, getMyRecommendations);

export default router;
