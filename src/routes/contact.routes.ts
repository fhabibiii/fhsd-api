import express from 'express';
import * as contactController from '../controllers/contact.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes - no authentication required
router.get('/', contactController.getContactInfo);

// Protected routes - admin only
router.post('/', authenticate, isAdmin, contactController.createContactInfo);
router.put('/', authenticate, isAdmin, contactController.updateContactInfo);

export default router;
