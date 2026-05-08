import { getProfile, updateProfile, deleteProfile, updateAvatar } from '../controllers/userController.js';
import upload from '../middleware/upload.middleware.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete('/profile', verifyToken, deleteProfile);
router.put('/profile/avatar', verifyToken, upload.single('avatar'), updateAvatar);

export default router;