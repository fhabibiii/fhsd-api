import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { getFileUrl } from '../utils/upload.utils';
import { sendSuccess, sendError } from '../utils/response.utils';

/**
 * Upload an image
 * Admin only - authentication required
 */
export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 'No file provided');
      return;
    }

    const { filename } = req.file;
      
    // Return the file URL directly without optimization
    const fileUrl = getFileUrl(filename);
    sendSuccess(res, 'Image uploaded successfully', { 
      filename, 
      url: fileUrl 
    }, 201);
  } catch (error) {
    console.error('File upload error:', error);
    next(error);
  }
};
