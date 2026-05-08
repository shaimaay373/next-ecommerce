import Product from '../models/Product.model.js';
import HTTPError from '../utils/HTTPError.js';


export const getAllProducts = async (req, res, next) => {
    try {
        const { search, category, minPrice, maxPrice, sort } = req.query;

        const filter = { isActive: true };

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let query = Product.find(filter)
            .populate('category', 'name slug')
            .populate('seller', 'name email');

        if (sort === 'price_asc') query = query.sort({ price: 1 });
        else if (sort === 'price_desc') query = query.sort({ price: -1 });
        else if (sort === 'rating') query = query.sort({ averageRating: -1 });
        else query = query.sort({ createdAt: -1 });

        const products = await query;
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) { next(err) }
};


export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('seller', 'name email')
            .populate('ratings.user', 'name');
        if (!product) return next(new HTTPError(404, 'Product not found'));
        res.status(200).json({ success: true, data: product });
    } catch (err) { next(err) }
};


// POST /products
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const product = await Product.create({
            name,
            description,
            price,
            images,
            category,
            stock,
            seller: req.user.userId
        });
        res.status(201).json({ success: true, data: product });
    } catch (err) { next(err) }
};

// PUT /products/:id
export const updateProduct = async (req, res, next) => {
    try {
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(f => `/uploads/${f.filename}`);
        }
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, seller: req.user.userId },
            updateData,
            { new: true, runValidators: true }
        );
        if (!product) return next(new HTTPError(404, 'Product not found or unauthorized'));
        res.status(200).json({ success: true, data: product });
    } catch (err) { next(err) }
};


export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, seller: req.user.userId },
            { isActive: false },
            { new: true }
        );
        if (!product) return next(new HTTPError(404, 'Product not found or unauthorized'));
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) { next(err) }
};


export const addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return next(new HTTPError(404, 'Product not found'));

       
        const alreadyReviewed = product.ratings.find(
            r => r.user.toString() === req.user.userId
        );
        if (alreadyReviewed) return next(new HTTPError(400, 'You already reviewed this product'));

        product.ratings.push({ user: req.user.userId, rating, comment });

     
        product.averageRating = product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length;

        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (err) { next(err) }
};