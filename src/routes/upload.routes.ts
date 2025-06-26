import express from 'express';
import * as uploadController from '../controllers/upload.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../utils/upload.utils';
import { rateLimit } from 'express-rate-limit';
import { sendError } from '../utils/response.utils';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Rate limiting for file uploads - 10 requests per minute
const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many upload requests, please try again later' }
});

// Custom multer error handler middleware
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File too large. Maximum size is 10MB', 400);
    }
    return sendError(res, err.message, 400);
  }
  next();
};

// Protected upload route with rate limiter - admin only
router.post('/image', 
  authenticate, 
  isAdmin, 
  uploadRateLimiter, 
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 'File too large. Maximum size is 10MB', 400);
        }
        return sendError(res, err.message, 400);
      }
      next();
    });
  }, 
  uploadController.uploadImage
);

export default router;
