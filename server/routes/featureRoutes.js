// routes/featureRoutes.js
const express = require('express');
const router = express.Router();
const { getFeatures, getFeaturesCount, createFeature, updateFeature, deleteFeature } = require('../controllers/featureController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', getFeatures);
router.get('/count', getFeaturesCount);

// Protected routes (admin only)
router.post('/', auth, createFeature);
router.put('/:id', auth, updateFeature);
router.delete('/:id', auth, deleteFeature);

module.exports = router; 