import User from './../models/User.model.js';
import HTTPError from '../utils/HTTPError.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';


// register user
export const registration = async (req, res, next) => {
    try {
        const { name, email, phone, password, address, role } = req.body;

      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new HTTPError(400, "Email already exists"));
        }
    
      
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            role: role || 'customer'
        });

        const { password: _, ...userData } = user.toObject();
           await sendEmail({
    to: email,
    subject: 'Welcome to E-Commerce!',
    html: `<h1>Welcome ${name}!</h1><p>Your account has been created successfully.</p>`
});
        res.status(201).json({ success: true, data: userData });

    } catch (err) { next(err) }
};

// login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new HTTPError(401, "Wrong Email or password"));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new HTTPError(401, "Wrong Email or password"));
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
        );

        const { password: _pw, ...safeUser } = user.toObject();

        return res.status(200).json({
            message: "user logged in successfully",
            accessToken,
            user: safeUser
        });

    } catch (err) { next(err) }
};
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
                html: `<h1>Welcome ${name}!</h1><p>Your account has been created successfully via Google.</p>`
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