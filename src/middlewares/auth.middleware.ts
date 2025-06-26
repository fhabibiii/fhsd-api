import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import prisma from '../prisma';
import { isTokenBlacklisted } from '../utils/token-blacklist';
import { sendError } from '../utils/response.utils';

// Extend Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication token is missing', 401);
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token is blacklisted (logged out)
    if (isTokenBlacklisted(token)) {
      sendError(res, 'Session expired. Please log in again.', 401);
      return;
    }
    
    // Verify the access token
    const decoded = verifyAccessToken(token);
    
    // Add user information to the request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    sendError(res, 'Authentication failed', 401);
    return;
  }
};

/**
 * Middleware to check if the user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    sendError(res, 'Authentication required', 401);
    return;
  }
  
  if (req.user.role !== 'admin') {
    sendError(res, 'Access denied. Admin role required', 403);
    return;
  }
  
  next();
};

/**
 * Middleware to verify if refresh token is valid and exists in the database
 */
export const validateRefreshToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      sendError(res, 'Refresh token is required');
      return;
    }
    
    // Check if the refresh token exists in the database
    const tokenExists = await prisma.authToken.findUnique({
      where: { refreshToken }
    });
    
    if (!tokenExists) {
      sendError(res, 'Invalid refresh token', 401);
      return;
    }
    
    // Check if the token has expired
    if (tokenExists.expiresAt < new Date()) {
      sendError(res, 'Refresh token has expired', 401);
      return;
    }
    
    next();
  } catch (error) {
    sendError(res, 'Internal server error', 500);
    return;
  }
};
