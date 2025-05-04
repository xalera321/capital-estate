// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    getCategoriesCount, 
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesWithPropertiesCount
} = require('../controllers/categoryController');
const verifyToken = require('../middlewares/auth');

// Public routes
router.get('/', getCategories);
router.get('/count', getCategoriesCount);

// Admin-only routes
router.get('/admin/with-counts', verifyToken, getCategoriesWithPropertiesCount);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

// This needs to be after the more specific routes
router.get('/:id', getCategoryById);

module.exports = router;