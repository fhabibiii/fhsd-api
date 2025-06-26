import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { sendSuccess, sendError } from '../utils/response.utils';

/**
 * Get contact information
 * Public endpoint - no authentication required
 */
export const getContactInfo = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    
    if (!contactInfo) {
      sendError(res, 'Contact information not found', 404);
      return;
    }
    
    sendSuccess(res, 'Contact information retrieved successfully', contactInfo);
    return;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    next(error);
  }
};

/**
 * Create contact information
 * Admin only - authentication required
 */
export const createContactInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone, email, address, map, instagram, whatsApp, workHours } = req.body;
    
    // Validate required fields
    if (!phone || !email || !address) {
      sendError(res, 'Phone, email, and address are required');
      return;
    }
    
    // Check if contact info already exists
    const existingContactInfo = await prisma.contactInfo.findFirst();
    
    if (existingContactInfo) {
      sendError(res, 'Contact information already exists. Please use the update endpoint.');
      return;
    }
    
    // Create contact info
    const newContactInfo = await prisma.contactInfo.create({
      data: {
        phone,
        email,
        address,
        map: map || '',
        instagram: instagram || '',
        whatsApp: whatsApp || '',
        workHours: workHours || ''
      }
    });
    
    sendSuccess(res, 'Contact information created successfully', newContactInfo, 201);
    return;
  } catch (error) {
    console.error('Error creating contact info:', error);
    next(error);
  }
};

/**
 * Update contact information
 * Admin only - authentication required
 */
export const updateContactInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone, email, address, map, instagram, whatsApp, workHours } = req.body;
    
    // Get existing contact info
    const existingContactInfo = await prisma.contactInfo.findFirst();
    
    if (!existingContactInfo) {
      sendError(res, 'Contact information not found. Please create it first.', 404);
      return;
    }
    
    // Update contact info
    const updatedContactInfo = await prisma.contactInfo.update({
      where: { id: existingContactInfo.id },
      data: {
        phone: phone !== undefined && phone !== '' ? phone : existingContactInfo.phone,
        email: email !== undefined && email !== '' ? email : existingContactInfo.email,
        address: address !== undefined && address !== '' ? address : existingContactInfo.address,
        map: map !== undefined && map !== '' ? map : existingContactInfo.map,
        instagram: instagram !== undefined && instagram !== '' ? instagram : existingContactInfo.instagram,
        whatsApp: whatsApp !== undefined && whatsApp !== '' ? whatsApp : existingContactInfo.whatsApp,
        workHours: workHours !== undefined && workHours !== '' ? workHours : existingContactInfo.workHours,
        updatedAt: new Date()
      }
    });
    
    sendSuccess(res, 'Contact information updated successfully', updatedContactInfo);
    return;
  } catch (error) {
    console.error('Error updating contact info:', error);
    next(error);
  }
};
