import express from 'express';
import multer from 'multer';
import {
  getPosts, getPost, getAdminPosts, createPost, updatePost, deletePost
} from '../controllers/postsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PUBLIC
router.get('/', getPosts);
router.get('/:id', getPost);

// ADMIN
router.get('/admin/all', authMiddleware, getAdminPosts);
router.post('/', authMiddleware, upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 2 }]), createPost);
router.put('/:id', authMiddleware, upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 2 }]), updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
