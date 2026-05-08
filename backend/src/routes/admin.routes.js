import { Router } from 'express';
import {
    getAllUsers, toggleUserStatus,
    getAllOrders, updateOrderStatus,
    getAllBanners, createBanner, deleteBanner,
    createPromo, deletePromo
} from '../controllers/adminController.js';
import { verifyToken, allowTo } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken, allowTo('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id', toggleUserStatus);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/banners', getAllBanners);
router.post('/banners', createBanner);
router.delete('/banners/:id', deleteBanner);
router.post('/promo', createPromo);
router.delete('/promo/:id', deletePromo);

export default router;