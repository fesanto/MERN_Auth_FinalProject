import { Router } from 'express';
import { createReview, getReviewsForBook } from '../controllers/reviewController';
import requireAuth from '../middleware/requireAuth';

const router = Router();

router.route('/').post(requireAuth, createReview); // Rota protegida
router.route('/:googleBooksId').get(getReviewsForBook);

export default router;