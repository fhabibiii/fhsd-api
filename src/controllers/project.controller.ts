import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { sendSuccess, sendError } from '../utils/response.utils';

/**
 * Get all projects
 * Public endpoint - no authentication required
 */
export const getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Handle empty results with appropriate message
    if (projects.length === 0) {
      sendSuccess(res, 'No projects available', []);
      return;
    }
    
    sendSuccess(res, 'Projects retrieved successfully', projects);
    return;
  } catch (error) {
    console.error('Error fetching projects:', error);
    next(error);
  }
};

/**
 * Get a project by ID
 * Public endpoint - no authentication required
 */
export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }
    
    sendSuccess(res, 'Project retrieved successfully', project);
    return;
  } catch (error) {
    console.error(`Error fetching project ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Create a new project
 * Admin only - authentication required
 */
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, image, link } = req.body;
    
    // Validate required fields
    if (!title || !description || !image) {
      sendError(res, 'Title, description and image are required');
      return;
    }
    
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        image,
        link: link || ''
      }
    });
    
    sendSuccess(res, 'Project created successfully', newProject, 201);
    return;
  } catch (error) {
    console.error('Error creating project:', error);
    next(error);
  }
};

/**
 * Update a project
 * Admin only - authentication required
 */
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, image, link } = req.body;
    
    // Check if project exists
    const projectExists = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!projectExists) {
      sendError(res, 'Project not found', 404);
      return;
    }
    
    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title : projectExists.title,
        description: description !== undefined ? description : projectExists.description,
        image: image !== undefined ? image : projectExists.image,
        link: link !== undefined ? link : projectExists.link,
        updatedAt: new Date()
      }
    });
    
    sendSuccess(res, 'Project updated successfully', updatedProject);
    return;
  } catch (error) {
    console.error('Error updating project:', error);
    next(error);
  }
};

/**
 * Delete a project
 * Admin only - authentication required
 */
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if project exists
    const projectExists = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!projectExists) {
      sendError(res, 'Project not found', 404);
      return;
    }
    
    // Delete project
    await prisma.project.delete({
      where: { id }
    });
    
    sendSuccess(res, 'Project deleted successfully');
    return;
  } catch (error) {
    console.error('Error deleting project:', error);
    next(error);
  }
};
