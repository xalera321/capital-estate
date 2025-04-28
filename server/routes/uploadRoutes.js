// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { handleUpload, uploadPhotos } = require('../controllers/uploadController');
const auth = require('../middlewares/auth');

// File upload route (protected)
router.post('/', auth, handleUpload, uploadPhotos);

module.exports = router; 