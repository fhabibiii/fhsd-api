import express from 'express';
import * as serviceController from '../controllers/service.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes - no authentication required
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Protected routes - admin only
router.post('/', authenticate, isAdmin, serviceController.createService);
router.put('/:id', authenticate, isAdmin, serviceController.updateService);
router.delete('/:id', authenticate, isAdmin, serviceController.deleteService);

export default router;
