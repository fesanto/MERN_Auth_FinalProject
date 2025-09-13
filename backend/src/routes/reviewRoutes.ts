import { Router } from 'express';
import { createReview, getReviewsForBook, updateReview, deleteReview } from '../controllers/reviewController';
import requireAuth from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, createReview);
router.get('/:googleBooksId', getReviewsForBook);
router.put('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;