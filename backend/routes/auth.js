// ============================================================
//  routes/auth.js — Login & Signup routes
// ============================================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/auth');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/sync (protected — upsert user from verified Clerk token)
router.post('/sync', requireAuth, authController.syncUser);

// GET /api/auth/me (protected)
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
