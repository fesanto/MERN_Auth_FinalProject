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

    console.log(`[createReview] A tentar criar uma review para o utilizador ID: ${userId}`);

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

        const populatedReview = await review.populate('user', 'name _id');
        res.status(201).json(populatedReview);
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
            .populate('user', 'name _id')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching reviews' });
    }
};


// @desc    Get all the reviews from the logged-in user
// @route   GET /api/reviews/my-reviews
export const getMyReviews = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    console.log(`[getMyReviews] A procurar por reviews do utilizador ID: ${req.user._id}`);

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const reviews = await Review.find({ user: req.user._id })
            .populate('book', 'googleBooksId')
            .sort({ createdAt: -1 });

        res.json(reviews);

    } catch (error) {
        res.status(500).json({ message: 'Erro de servidor ao buscar as reviews' });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
export const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();
        const populatedReview = await Review.findById(review._id).populate('user', 'name _id');
        res.json(populatedReview);

    } catch (error) {
        res.status(500).json({ message: 'Server error while updating the review' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        await review.deleteOne();
        res.json({ message: 'Review successfully removed' });

    } catch (error) {
        res.status(500).json({ message: 'Server error when deleting the review' });
    }
};