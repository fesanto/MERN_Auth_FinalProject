import { Router } from 'express';
import { createReview, getReviewsForBook, updateReview, deleteReview, getMyReviews } from '../controllers/reviewController';
import requireAuth from '../middleware/requireAuth';

const router = Router();

router.get('/my-reviews', requireAuth, getMyReviews);
router.get('/:googleBooksId', getReviewsForBook);
router.post('/', requireAuth, createReview);
router.put('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);


export default router;