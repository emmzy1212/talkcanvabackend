import express from 'express';
import multer from 'multer';
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ✅ Memory storage for buffer upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);

// Admin routes
router.post('/', authMiddleware, upload.single('photo'), createTeamMember);
router.put('/:id', authMiddleware, upload.single('photo'), updateTeamMember);
router.delete('/:id', authMiddleware, deleteTeamMember);

export default router;
