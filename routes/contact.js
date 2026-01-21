import express from 'express';
import {
  submitContact,
  getContacts,
  markContactAsRead,
  deleteContact,
} from '../controllers/contactController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Admin routes
router.get('/', authMiddleware, getContacts);
router.put('/:id/read', authMiddleware, markContactAsRead);
router.delete('/:id', authMiddleware, deleteContact);

export default router;
