import { Router } from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { verifyToken, allowTo } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', verifyToken, allowTo('admin'), upload.single('image'), createCategory);
router.put('/:id', verifyToken, allowTo('admin'), upload.single('image'), updateCategory);
router.delete('/:id', verifyToken, allowTo('admin'), deleteCategory);

export default router;