import express from 'express';
const router = express.Router();
import { login, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

// POST /api/login
router.post('/login', login);

// GET /api/me - Get current user (protected route)
router.get('/me', authMiddleware, getCurrentUser);

export default router;
