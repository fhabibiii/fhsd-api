import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';

export class HttpException extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const errorHandler = (
  err: Error | HttpException, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error(`Error: ${err.message}`);
  
  if (err instanceof HttpException) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle multer errors
  if (err && err.message && err.message.includes('MulterError')) {
    sendError(res, err.message, 400);
    return;
  }

  // Default to 500 server error
  const errorMessage = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  sendError(res, errorMessage, 500);
  return;
};

// 404 Not Found middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
