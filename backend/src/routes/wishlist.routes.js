import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';

const router = Router();

router.get('/', verifyToken, getWishlist);
router.post('/:productId', verifyToken, addToWishlist);
router.delete('/:productId', verifyToken, removeFromWishlist);

export default router;
