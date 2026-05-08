import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import HTTPError from '../utils/HTTPError.js';

// GET /cart
export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId })
            .populate('items.product', 'name price images stock');
        if (!cart) return res.status(200).json({ success: true, data: { items: [] } });
        res.status(200).json({ success: true, data: cart });
    } catch (err) { next(err) }
};

// POST /cart
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) return next(new HTTPError(404, 'Product not found'));
        if (product.stock < quantity) return next(new HTTPError(400, 'Not enough stock'));

        let cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }

        await cart.populate('items.product', 'name price images stock');
        res.status(200).json({ success: true, data: cart });
    } catch (err) { next(err) }
};

// PUT /cart/:productId
export const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return next(new HTTPError(404, 'Cart not found'));

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === req.params.productId
        );
        if (itemIndex === -1) return next(new HTTPError(404, 'Item not found in cart'));

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product', 'name price images stock');
        res.status(200).json({ success: true, data: cart });
    } catch (err) { next(err) }
};

// DELETE /cart/:productId
export const removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return next(new HTTPError(404, 'Cart not found'));

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        res.status(200).json({ success: true, message: 'Item removed from cart' });
    } catch (err) { next(err) }
};

// DELETE /cart
export const clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndDelete({ user: req.user.userId });
        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (err) { next(err) }
};