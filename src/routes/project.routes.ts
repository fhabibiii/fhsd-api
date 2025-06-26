import express from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes - no authentication required
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Protected routes - admin only
router.post('/', authenticate, isAdmin, projectController.createProject);
router.put('/:id', authenticate, isAdmin, projectController.updateProject);
router.delete('/:id', authenticate, isAdmin, projectController.deleteProject);

export default router;
