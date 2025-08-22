import { Router } from 'express';
import { searchBooks, getBookById } from '../controllers/bookController';

const router = Router();

router.get('/search', searchBooks);
router.get('/:id', getBookById); 

export default router;