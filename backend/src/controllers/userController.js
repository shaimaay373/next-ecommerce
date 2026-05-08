import User from '../models/User.model.js';
import HTTPError from '../utils/HTTPError.js';
import upload from '../middleware/upload.middleware.js';


// GET /profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return next(new HTTPError(404, 'User not found'));
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err) }
};

// PUT /profile
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address, paymentDetails } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, phone, address, paymentDetails },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return next(new HTTPError(404, 'User not found'));
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err) }
};
export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) return next(new HTTPError(400, 'No image uploaded'));
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { avatar: `/uploads/${req.file.filename}` },
            { new: true }
        ).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err) }
};
export const deleteProfile = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { isActive: false },
            { new: true }
        );
        if (!user) return next(new HTTPError(404, 'User not found'));
        res.status(200).json({ success: true, message: 'Account deactivated successfully' });
    } catch (err) { next(err) }
};