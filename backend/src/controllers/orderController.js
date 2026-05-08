import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Cart from '../models/Cart.model.js';
import Promo from '../models/Promo.model.js';
import HTTPError from '../utils/HTTPError.js';
import sendEmail from '../utils/sendEmail.js';

// POST /orders
export const placeOrder = async (req, res, next) => {
    try {
        const { items, paymentMethod, address, promoCode, guestEmail } = req.body;

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return next(new HTTPError(404, `Product not found`));
            if (product.stock < item.quantity) return next(new HTTPError(400, `Not enough stock for ${product.name}`));

            totalPrice += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // apply promo code
        let discount = 0;
        if (promoCode) {
            const promo = await Promo.findOne({ code: promoCode.toUpperCase(), isActive: true });
            if (!promo) return next(new HTTPError(400, 'Invalid promo code'));
            if (promo.expiresAt && promo.expiresAt < new Date()) return next(new HTTPError(400, 'Promo code expired'));
            if (promo.maxUses && promo.usedCount >= promo.maxUses) return next(new HTTPError(400, 'Promo code limit reached'));

            if (promo.discountType === 'percentage') {
                discount = (totalPrice * promo.discountValue) / 100;
            } else {
                discount = promo.discountValue;
            }

            promo.usedCount += 1;
            await promo.save();
        }

        totalPrice -= discount;

        const order = await Order.create({
            user: req.user?.userId || null,
            guestEmail: guestEmail || null,
            items: orderItems,
            totalPrice,
            paymentMethod,
            address,
            promoCode: promoCode || null,
            discount
        });

        // clear cart if logged in
        if (req.user?.userId) {
            await Cart.findOneAndDelete({ user: req.user.userId });
        }

        // send confirmation email
        const emailTo = req.user?.userId ? null : guestEmail;
        if (emailTo || req.user?.userId) {
            await sendEmail({
                to: emailTo || req.body.email,
                subject: 'Order Confirmed!',
                html: `<h2>Your order has been placed successfully!</h2>
                       <p>Order ID: ${order._id}</p>
                       <p>Total: $${totalPrice}</p>
                       <p>Payment Method: ${paymentMethod}</p>`
            });
        }

        res.status(201).json({ success: true, data: order });
    } catch (err) { next(err) }
};

// GET /orders/my
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (err) { next(err) }
};

// GET /orders/:id
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name price images');
        if (!order) return next(new HTTPError(404, 'Order not found'));
        res.status(200).json({ success: true, data: order });
    } catch (err) { next(err) }
};