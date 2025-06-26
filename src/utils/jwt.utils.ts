import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPayload, TokenData } from '../types/auth.types';
import { JWT_CONFIG } from '../config/jwt.config';

export function generateAccessToken(payload: TokenPayload): TokenData {
  const options: SignOptions = {
    expiresIn: JWT_CONFIG.accessToken.expiresIn as any
  };
  
  const token = jwt.sign(
    payload as object, 
    JWT_CONFIG.accessToken.secret,
    options
  );
  
  return {
    token,
    expiresIn: JWT_CONFIG.accessToken.expiresIn
  };
}

export function generateRefreshToken(payload: TokenPayload): TokenData {
  const options: SignOptions = {
    expiresIn: JWT_CONFIG.refreshToken.expiresIn as any
  };
  
  const token = jwt.sign(
    payload as object,
    JWT_CONFIG.refreshToken.secret,
    options
  );
  
  return {
    token,
    expiresIn: JWT_CONFIG.refreshToken.expiresIn
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.accessToken.secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.refreshToken.secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
