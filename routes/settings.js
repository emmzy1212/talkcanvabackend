import express from 'express';
import multer from 'multer';
import {
  getSettings,
  updateSettings,
  uploadLogo,
  uploadHeroImage,
  uploadMaintenanceImage,
} from '../controllers/settingsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getSettings);
router.put('/', authMiddleware, updateSettings);
router.post('/logo', authMiddleware, upload.single('logo'), uploadLogo);
router.post('/hero-image', authMiddleware, upload.single('image'), uploadHeroImage);
router.post('/maintenance-image', authMiddleware, upload.single('image'), uploadMaintenanceImage);

export default router;
