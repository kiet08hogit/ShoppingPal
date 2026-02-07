import { Router } from 'express';
import { getProfile, createOrUpdateProfile } from '../controller/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', requireAuth as any, getProfile);
router.post('/profile', requireAuth as any, createOrUpdateProfile);

export default router;
