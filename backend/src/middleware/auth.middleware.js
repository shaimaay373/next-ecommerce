import jwt from 'jsonwebtoken';
import HTTPError from '../utils/HTTPError.js';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new HTTPError(401, 'No token provided'));
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return next(new HTTPError(401, 'Invalid or expired token'));
    }
};

export const allowTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HTTPError(403, 'You are not allowed to do this action'));
        }
        next();
    };
};