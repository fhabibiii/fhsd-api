import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Force reload the .env file to get the latest values
try {
  const envPath = path.resolve(process.cwd(), '.env');
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const envVars = envConfig.split('\n').reduce<Record<string, string>>((acc, line) => {
    const match = line.match(/^([^=]+)="?([^"]*)"?$/);
    if (match) {
      const [_, key, value] = match;
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
  
  // Update process.env with the latest values
  Object.keys(envVars).forEach(key => {
    process.env[key] = envVars[key];
  });
} catch (error) {
  console.error('Error loading .env file:', error);
}

export const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15s'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
  }
};
