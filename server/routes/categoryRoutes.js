// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { getCategories, getCategoriesCount } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/count', getCategoriesCount);

module.exports = router;