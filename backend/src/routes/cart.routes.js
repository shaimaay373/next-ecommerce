import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.put('/:productId', verifyToken, updateCartItem);
router.delete('/:productId', verifyToken, removeFromCart);
router.delete('/', verifyToken, clearCart);

export default router;