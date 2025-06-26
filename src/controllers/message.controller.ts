import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { sendSuccess, sendError } from '../utils/response.utils';
import { sendTelegramNotification } from '../utils/telegram.utils';

/**
 * Get all messages with limited fields (for admin)
 * Admin only - authentication required
 */
export const getAllMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await prisma.message.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        budget: true,
        createdAt: true,
        isRead: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (messages.length === 0) {
      sendSuccess(res, 'No messages available', []);
      return;
    }
    
    sendSuccess(res, 'Messages retrieved successfully', messages);
    return;
  } catch (error) {
    console.error('Error fetching messages:', error);
    next(error);
  }
};

/**
 * Get a message by ID with all fields (for admin)
 * Admin only - authentication required
 */
export const getMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const message = await prisma.message.findUnique({
      where: { id }
    });
    
    if (!message) {
      sendError(res, 'Message not found', 404);
      return;
    }
    
    sendSuccess(res, 'Message retrieved successfully', message);
    return;
  } catch (error) {
    console.error(`Error fetching message ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Create a new message (public endpoint)
 */
export const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, type, budget, detail } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !type || !budget || !detail) {
      sendError(res, 'All fields are required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendError(res, 'Invalid email format');
      return;
    }
    
    // Create message
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        type,
        budget,
        detail
      }
    });
    
    // Send notification to Telegram
    const telegramMessage = `<b>📬 New Message Received</b>\n\n<b>From:</b> ${name}\n<b>Email:</b> ${email}\n<b>Phone:</b> ${phone}\n<b>Type:</b> ${type}\n<b>Budget:</b> ${budget}\n\n<b>Detail:</b>\n${detail}`;
    
    // Send notification asynchronously - don't wait for it to complete
    sendTelegramNotification(telegramMessage).catch(err => {
      console.error('Failed to send Telegram notification:', err);
    });
    
    sendSuccess(res, 'Message sent successfully', newMessage, 201);
    return;
  } catch (error) {
    console.error('Error creating message:', error);
    next(error);
  }
};

/**
 * Mark a message as read
 * Admin only - authentication required
 */
export const updateMessageReadStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if message exists
    const messageExists = await prisma.message.findUnique({
      where: { id }
    });
    
    if (!messageExists) {
      sendError(res, 'Message not found', 404);
      return;
    }
    
    // Update message's read status
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        isRead: true
      }
    });
    
    sendSuccess(res, 'Message marked as read', updatedMessage);
    return;
  } catch (error) {
    console.error(`Error marking message ${req.params.id} as read:`, error);
    next(error);
  }
};

/**
 * Delete a message
 * Admin only - authentication required
 */
export const deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if message exists
    const messageExists = await prisma.message.findUnique({
      where: { id }
    });
    
    if (!messageExists) {
      sendError(res, 'Message not found', 404);
      return;
    }
    
    // Delete message
    await prisma.message.delete({
      where: { id }
    });
    
    sendSuccess(res, 'Message deleted successfully');
    return;
  } catch (error) {
    console.error(`Error deleting message ${req.params.id}:`, error);
    next(error);
  }
};
