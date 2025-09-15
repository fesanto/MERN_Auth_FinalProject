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
    const { name, email, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'The email address is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = createToken(user._id as mongoose.Types.ObjectId);

        res.status(201).json({ id: user._id, name: user.name, email: user.email, token: token });
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

        res.json({ id: user._id, email: user.email, token: token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in.' });
    }
};

// Get the logged user's information
export const getMe = (req: AuthRequest, res: Response) => {
    // req.user é populado pelo middleware requireAuth
    if (!req.user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json(req.user);
};

// Update the logged user's profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};
