import { Router } from 'express';
import { getSellerProducts, getSellerOrders } from '../controllers/sellerController.js';
import { verifyToken, allowTo } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken, allowTo('seller', 'admin'));

router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);

export default router;