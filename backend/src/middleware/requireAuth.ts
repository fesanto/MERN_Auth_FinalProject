import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

// Interface para o payload decodificado do JWT
interface JwtPayload {
    id: string | mongoose.Types.ObjectId;
}

// Estende a interface Request para incluir nossa propriedade 'user'
interface AuthRequest extends Request {
    user?: IUser | null;
}

const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado. Token não fornecido.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET não definido no .env');
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Procura o usuário no banco de dados sem a senha
        req.user = await User.findById(decoded.id).select('-password');

        // Se o usuário não for encontrado após decodificar o token
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        next(); // Se o token for válido e o usuário encontrado, continua
    } catch (err) {
        res.status(401).json({ message: 'Token inválido.' });
    }
};

export default requireAuth;