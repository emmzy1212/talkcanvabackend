import express from 'express';
import { login, getAdmin } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public login
router.post('/login', login);

// Protected route
router.get('/me', authMiddleware, getAdmin);

export default router;
