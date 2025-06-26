import { Response } from 'express';

/**
 * Standard response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Send a standardized success response
 * @param res Express Response object
 * @param message Success message
 * @param data Response data (optional)
 * @param statusCode HTTP status code (default: 200)
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data: data || null
  };
  
  res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 * @param res Express Response object
 * @param message Error message
 * @param statusCode HTTP status code (default: 400)
 * @param data Additional error data (optional)
 */
export const sendError = <T>(
  res: Response,
  message: string,
  statusCode = 400,
  data?: T
): void => {
  const response: ApiResponse<T> = {
    success: false,
    message,
    data: data || null
  };
  
  res.status(statusCode).json(response);
};
