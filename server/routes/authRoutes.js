// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// Authentication routes
router.post('/login', authController.login);
router.post('/verify', authController.verify2FA);
router.post('/setup', authController.setup2FA);
router.get('/check', authMiddleware, authController.checkAuth);

module.exports = router;