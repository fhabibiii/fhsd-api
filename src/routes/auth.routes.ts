import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, isAdmin, validateRefreshToken } from '../middlewares/auth.middleware';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiting for authentication endpoints - 5 requests per minute
const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later' }
});

// Routes
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);
router.post('/logout', authenticate, isAdmin, authController.logout);

export default router;
