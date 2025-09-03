import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import reviewRoutes from './routes/reviewRoutes';

dotenv.config();

const app = express();
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'] // Allowed HTTP methods
};

console.log(`CORS Origin configurado para: ${corsOptions.origin}`);

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes); // All authentication-related routes will be prefixed with /api/auth
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((err) => console.error('MongoDB connection error:', err));