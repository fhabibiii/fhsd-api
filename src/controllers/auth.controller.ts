import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { TokenPayload, excludePassword } from '../types/auth.types';
import { addDays } from 'date-fns';
import { blacklistToken } from '../utils/token-blacklist';
import { sendSuccess, sendError } from '../utils/response.utils';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
      sendError(res, 'Username and password are required');
      return;
    }
    
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    // Check if user exists
    if (!user) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }
    
    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    // Calculate refresh token expiry date (7 days from now)
    const expiresAt = addDays(new Date(), 7);
    
    // Save refresh token to database
    await prisma.authToken.create({
      data: {
        userId: user.id,
        refreshToken: refreshToken.token,
        expiresAt
      }
    });
    
    const userWithoutPassword = excludePassword(user);
    
    // Return access token and refresh token
    sendSuccess(res, 'Login successful', {
      user: userWithoutPassword,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token
    });
    return;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred during login'));
    }
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: refreshTokenString } = req.body;
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshTokenString);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    
    // Generate new tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    
    // Calculate refresh token expiry date (7 days from now)
    const expiresAt = addDays(new Date(), 7);
    
    // Strategi 1: Hapus SEMUA token milik user tersebut dulu
    // Ini menghindari masalah dengan token duplicate
    await prisma.authToken.deleteMany({
      where: { 
        userId: user.id
      }
    });
    
    // Strategi 2: Tunggu sedikit untuk memastikan proses delete selesai sepenuhnya di database
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Buat token baru setelah memastikan semua token lama terhapus
      await prisma.authToken.create({
        data: {
          userId: user.id,
          refreshToken: newRefreshToken.token,
          expiresAt
        }
      });
    } catch (createError: any) {
      // Jika masih error, blacklist token lama dan berikan pesan yang lebih jelas
      await blacklistToken(refreshTokenString, expiresAt);
      console.error('Failed to create refresh token:', createError);
      sendError(res, 'Terjadi kesalahan saat refresh token, silakan login ulang', 500);
      return;
    }
    
    // Return new access token and refresh token
    sendSuccess(res, 'Token refreshed successfully', {
      accessToken: accessToken.token,
      refreshToken: newRefreshToken.token
    });
    return;
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred while refreshing token'));
    }
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    
    // Verify that the token belongs to the authenticated user
    if (!req.user || tokenExists.userId !== req.user.userId) {
      sendError(res, 'You can only logout from your own sessions', 403);
      return;
    }

    // Get the authorization header to blacklist the access token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.split(' ')[1];
      
      // Add the access token to the blacklist
      // Set expiry to 1 day from now (matching our token expiry)
      const accessTokenExpiry = addDays(new Date(), 1);
      blacklistToken(accessToken, accessTokenExpiry);
    }
    
    // Delete the refresh token from the database
    await prisma.authToken.delete({
      where: { refreshToken }
    });
    
    // Return success message
    sendSuccess(res, 'Logged out successfully');
    return;
  } catch (error) {
    console.error('Logout error:', error);
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred during logout'));
    }
  }
};
