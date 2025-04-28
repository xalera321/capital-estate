// controllers/categoryController.js
const { Category } = require('../models');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'description']
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

exports.getCategoriesCount = async (req, res) => {
    try {
        const count = await Category.count();
        res.json({ count });
    } catch (error) {
        console.error('Count error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};