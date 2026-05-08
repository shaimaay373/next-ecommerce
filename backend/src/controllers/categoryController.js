import Category from '../models/Category.model.js';
import HTTPError from '../utils/HTTPError.js';

// GET /categories
export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.status(200).json({ success: true, data: categories });
    } catch (err) { next(err) }
};

// GET /categories/:id
export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return next(new HTTPError(404, 'Category not found'));
        res.status(200).json({ success: true, data: category });
    } catch (err) { next(err) }
};

// POST /categories
export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const slug = name.toLowerCase().replace(/ /g, '-');
        const existing = await Category.findOne({ slug });
        if (existing) return next(new HTTPError(400, 'Category already exists'));
        const category = await Category.create({ name, slug, image });
        res.status(201).json({ success: true, data: category });
    } catch (err) { next(err) }
};

// PUT /categories/:id
export const updateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-');
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;
        const updateData = { name, slug };
        if (image) updateData.image = image;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!category) return next(new HTTPError(404, 'Category not found'));
        res.status(200).json({ success: true, data: category });
    } catch (err) { next(err) }
};

// DELETE /categories/:id
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!category) return next(new HTTPError(404, 'Category not found'));
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) { next(err) }
};