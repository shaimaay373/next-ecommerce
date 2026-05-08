import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview
} from '../controllers/productController.js';
import { verifyToken, allowTo } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, allowTo('admin', 'seller'), upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, allowTo('admin', 'seller'), upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, allowTo('admin', 'seller'), deleteProduct);
router.post('/:id/reviews', verifyToken, addReview);

export default router;