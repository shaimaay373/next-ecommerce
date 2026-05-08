import { Router } from 'express';
import { placeOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', placeOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);

export default router;