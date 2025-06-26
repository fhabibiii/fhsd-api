/**
 * In-memory token blacklist implementation
 * This provides a simple way to invalidate tokens without needing database changes
 */

interface BlacklistedToken {
  token: string;
  expiresAt: Date;
}

// In-memory store for blacklisted tokens
const blacklistedTokens: BlacklistedToken[] = [];

/**
 * Add a token to the blacklist
 * @param token - The token to blacklist
 * @param expiresAt - When the token expires (used for cleanup)
 */
export const blacklistToken = (token: string, expiresAt: Date): void => {
  // Clean up expired tokens first to keep the list small
  cleanupExpiredTokens();
  
  // Add token to blacklist
  blacklistedTokens.push({
    token,
    expiresAt
  });
};

/**
 * Check if a token is blacklisted
 * @param token - The token to check
 * @returns boolean - True if token is blacklisted
 */
export const isTokenBlacklisted = (token: string): boolean => {
  return blacklistedTokens.some(item => item.token === token);
};

/**
 * Remove expired tokens from the blacklist
 */
export const cleanupExpiredTokens = (): void => {
  const now = new Date();
  const initialCount = blacklistedTokens.length;
  
  // Filter out expired tokens
  const validTokens = blacklistedTokens.filter(item => item.expiresAt > now);
  
  // Update the blacklist
  blacklistedTokens.length = 0;
  blacklistedTokens.push(...validTokens);
};
