import { Router } from 'express';
import * as authController from '../controllers/authController';
import requireAuth from '../middleware/requireAuth';

const router: Router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/me', requireAuth, authController.getMe);

export default router;