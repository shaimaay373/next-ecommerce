import User from '../models/User.model.js';
import HTTPError from '../utils/HTTPError.js';

// GET /wishlist
export const getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('wishlist', 'name price images averageRating');
        res.status(200).json({ success: true, data: user.wishlist });
    } catch (err) { next(err) }
};

// POST /wishlist/:productId
export const addToWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user.wishlist.includes(req.params.productId)) {
            return next(new HTTPError(400, 'Product already in wishlist'));
        }
        user.wishlist.push(req.params.productId);
        await user.save();
        res.status(200).json({ success: true, message: 'Added to wishlist' });
    } catch (err) { next(err) }
};

// DELETE /wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        user.wishlist = user.wishlist.filter(
            id => id.toString() !== req.params.productId
        );
        await user.save();
        res.status(200).json({ success: true, message: 'Removed from wishlist' });
    } catch (err) { next(err) }
};