import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import HTTPError from '../utils/HTTPError.js';

// GET /seller/products
export const getSellerProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ seller: req.user.userId })
            .populate('category', 'name');
        res.status(200).json({ success: true, data: products });
    } catch (err) { next(err) }
};

// GET /seller/orders
export const getSellerOrders = async (req, res, next) => {
    try {
        const products = await Product.find({ seller: req.user.userId }).select('_id');
        const productIds = products.map(p => p._id);

        const orders = await Order.find({
            'items.product': { $in: productIds }
        }).populate('items.product', 'name price')
          .populate('user', 'name email')
          .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (err) { next(err) }
};