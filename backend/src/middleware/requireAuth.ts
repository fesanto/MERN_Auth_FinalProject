import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

interface JwtPayload {
    id: string | mongoose.Types.ObjectId;
}

interface AuthRequest extends Request {
    user?: IUser | null;
}

const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Token not provided.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET not defined in .env');
    }

    try {
        // Check and decode the token
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Searches for the user in the database without the password
        req.user = await User.findById(decoded.id).select('-password');

        // If the user is not found after decoding the token
        if (!req.user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        next(); 
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

export default requireAuth;