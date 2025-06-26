import express from 'express';
import * as messageController from '../controllers/message.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiting for message submissions - 3 requests per 5 minutes
const messageRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 3 submissions per IP per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many message submissions, please try again later' }
});

// Public route with rate limiter
router.post('/', messageRateLimiter, messageController.createMessage);

// Protected routes - admin only
router.get('/', authenticate, isAdmin, messageController.getAllMessages);
router.get('/:id', authenticate, isAdmin, messageController.getMessageById);
router.patch('/:id/read', authenticate, isAdmin, messageController.updateMessageReadStatus);
router.delete('/:id', authenticate, isAdmin, messageController.deleteMessage);

export default router;
