import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { sendSuccess, sendError } from '../utils/response.utils';

/**
 * Get all services with their features
 * Public endpoint - no authentication required
 */
export const getAllServices = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      include: {
        features: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (services.length === 0) {
      sendSuccess(res, 'No services available', []);
      return;
    }
    
    sendSuccess(res, 'Services retrieved successfully', services);
    return;
  } catch (error) {
    console.error('Error fetching services:', error);
    next(error);
  }
};

/**
 * Get a service by ID with its features
 * Public endpoint - no authentication required
 */
export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        features: true
      }
    });
    
    if (!service) {
      sendError(res, 'Service not found', 404);
      return;
    }
    
    sendSuccess(res, 'Service retrieved successfully', service);
    return;
  } catch (error) {
    console.error(`Error fetching service ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Create a new service with features
 * Admin only - authentication required
 */
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, price, duration, features } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !duration) {
      sendError(res, 'Title, description, price, and duration are required');
      return;
    }
    
    // Create service with features
    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price,
        duration,
        features: {
          create: Array.isArray(features) ? features.map(feature => ({ feature })) : []
        }
      },
      include: {
        features: true
      }
    });
    
    sendSuccess(res, 'Service created successfully', newService, 201);
    return;
  } catch (error) {
    console.error('Error creating service:', error);
    next(error);
  }
};

/**
 * Update a service and its features
 * Admin only - authentication required
 */
export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, features } = req.body;
    
    // Check if service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id }
    });
    
    if (!serviceExists) {
      sendError(res, 'Service not found', 404);
      return;
    }
    
    // Start a transaction to update service and features
    const updatedService = await prisma.$transaction(async (prisma) => {
      // Update service
      const service = await prisma.service.update({
        where: { id },
        data: {
          title: title !== undefined ? title : serviceExists.title,
          description: description !== undefined ? description : serviceExists.description,
          price: price !== undefined ? price : serviceExists.price,
          duration: duration !== undefined ? duration : serviceExists.duration,
          updatedAt: new Date()
        }
      });
      
      // If features are provided, delete existing features and create new ones
      if (Array.isArray(features)) {
        // Delete existing features
        await prisma.serviceFeature.deleteMany({
          where: { serviceId: id }
        });
        
        // Create new features
        await prisma.serviceFeature.createMany({
          data: features.map(feature => ({
            serviceId: id,
            feature
          }))
        });
      }
      
      // Return service with updated features
      return prisma.service.findUnique({
        where: { id },
        include: {
          features: true
        }
      });
    });
    
    sendSuccess(res, 'Service updated successfully', updatedService);
    return;
  } catch (error) {
    console.error('Error updating service:', error);
    next(error);
  }
};

/**
 * Delete a service and its features (cascade delete)
 * Admin only - authentication required
 */
export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id }
    });
    
    if (!serviceExists) {
      sendError(res, 'Service not found', 404);
      return;
    }
    
    // Delete service (features will be deleted automatically due to cascade delete)
    await prisma.service.delete({
      where: { id }
    });
    
    sendSuccess(res, 'Service deleted successfully');
    return;
  } catch (error) {
    console.error('Error deleting service:', error);
    next(error);
  }
};
