import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    id: string | mongoose.Types.ObjectId;
}

const createToken = (id: mongoose.Types.ObjectId): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET not defined in .env');
    }
    return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// Register a new user
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'The email address is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ email, password: hashedPassword });

        const token = createToken(user._id as mongoose.Types.ObjectId);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });

        res.status(201).json({ id: user._id, email: user.email, token: token });
    } catch (err) {
        res.status(500).json({ message: 'Error when registering user.' });
    }
};

// Log in an existing user
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = createToken(user._id as mongoose.Types.ObjectId);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ id: user._id, email: user.email, token: token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in.' });
    }
};

// Logout user by clearing the cookie
export const logout = (req: Request, res: Response) => {
    res.clearCookie('token').json({ message: 'Logout successful.' });
};

// Get the logged user's information
export const getMe = (req: AuthRequest, res: Response) => {
    // req.user é populado pelo middleware requireAuth
    if (!req.user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json(req.user);
};
