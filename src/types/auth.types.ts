import { User } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserWithoutPassword {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export function excludePassword(user: User): UserWithoutPassword {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
