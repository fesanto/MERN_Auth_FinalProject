import { Router } from 'express';
import * as authController from '../controllers/authController';
import requireAuth from '../middleware/requireAuth';

const router: Router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Logged user routes
router.get('/me', requireAuth, authController.getMe);
// Update user profile
router.put('/me', requireAuth, authController.updateUserProfile);

export default router;