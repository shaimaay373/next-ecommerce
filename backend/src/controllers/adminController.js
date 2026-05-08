import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Banner from '../models/Banner.model.js';
import Promo from '../models/Promo.model.js';
import HTTPError from '../utils/HTTPError.js';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// GET /admin/users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (err) { next(err) }
};

// PATCH /admin/users/:id
export const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(new HTTPError(404, 'User not found'));
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'restricted'}` });
    } catch (err) { next(err) }
};

// GET /admin/orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (err) { next(err) }
};

// PATCH /admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email');
        if (!order) return next(new HTTPError(404, 'Order not found'));

        if (order.user?.email) {
            await sendEmail({
                to: order.user.email,
                subject: 'Order Status Updated',
                html: `<h2>Your order status has been updated</h2>
                       <p>Order ID: ${order._id}</p>
                       <p>New Status: <strong>${status}</strong></p>`
            });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) { next(err) }
};

// GET /admin/banners
export const getAllBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find();
        res.status(200).json({ success: true, data: banners });
    } catch (err) { next(err) }
};

// POST /admin/banners
export const createBanner = async (req, res, next) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json({ success: true, data: banner });
    } catch (err) { next(err) }
};

// DELETE /admin/banners/:id
export const deleteBanner = async (req, res, next) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Banner deleted' });
    } catch (err) { next(err) }
};

// POST /admin/promo
export const createPromo = async (req, res, next) => {
    try {
        const promo = await Promo.create(req.body);
        res.status(201).json({ success: true, data: promo });
    } catch (err) { next(err) }
};

// DELETE /admin/promo/:id
export const deletePromo = async (req, res, next) => {
    try {
        await Promo.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Promo deleted' });
    } catch (err) { next(err) }
};

// POST /auth/google
export const googleAuth = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = await User.create({
                name,
                email,
                phone: 'N/A',
                password: randomPassword,
                role: 'customer',
                isEmailVerified: true,
                avatar
            });

            await sendEmail({
                to: email,
                subject: 'Welcome to FreshCart! 🛒',
                html: `
                    <h1>Welcome ${name}!</h1>
                    <p>Your account has been created successfully via Google.</p>
                    <p>Start shopping now at FreshCart!</p>
                `
            });
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
        );

        const { password: _, ...safeUser } = user.toObject();

        res.status(200).json({ accessToken, user: safeUser });

    } catch (err) { next(err) }
};