import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import Review from '../models/Review';
import Book from '../models/Book';

// @desc    Create a new review
// @route   POST /api/reviews
export const createReview = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { googleBooksId, rating, comment } = req.body;
    const userId = req.user._id;

    try {
        let book = await Book.findOne({ googleBooksId });
        if (!book) {
            book = await Book.create({ googleBooksId });
        }

        const review = await Review.create({
            user: userId,
            book: book._id,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating review' });
    }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/:googleBooksId
export const getReviewsForBook = async (req: AuthRequest, res: Response) => {
    try {
        const book = await Book.findOne({ googleBooksId: req.params.googleBooksId });
        if (!book) {
            return res.json([]); // no books, no reviews
        }

        const reviews = await Review.find({ book: book._id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching reviews' });
    }
};