// controllers/categoryController.js
const { Category, Property } = require('../models');

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

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        
        if (!category) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }
        
        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({ error: 'Название категории обязательно' });
        }
        
        // Create the category
        const category = await Category.create({
            name,
            description: description || ''
        });
        
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        
        // Check for unique constraint violation
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Категория с таким названием уже существует' });
        }
        
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({ error: 'Название категории обязательно' });
        }
        
        // Find the category
        const category = await Category.findByPk(id);
        
        if (!category) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }
        
        // Update the category
        await category.update({
            name,
            description: description || ''
        });
        
        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        
        // Check for unique constraint violation
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Категория с таким названием уже существует' });
        }
        
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the category
        const category = await Category.findByPk(id);
        
        if (!category) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }
        
        // Check if category has associated properties
        const propertiesCount = await Property.count({ where: { category_id: id } });
        
        if (propertiesCount > 0) {
            return res.status(400).json({ 
                error: 'Невозможно удалить категорию, так как с ней связаны объекты недвижимости',
                propertiesCount
            });
        }
        
        // Delete the category
        await category.destroy();
        
        res.json({ message: 'Категория успешно удалена' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Get categories with properties count
exports.getCategoriesWithPropertiesCount = async (req, res) => {
    try {
        console.log('Fetching categories with property counts...');
        
        // Simplified query - first get all categories
        const categories = await Category.findAll({
            attributes: [
                'id', 
                'name', 
                'description', 
                'createdAt',
                'updatedAt'
            ]
        });
        
        console.log('Found categories:', categories.length);
        
        // Get property counts for each category
        const categoriesWithCounts = await Promise.all(categories.map(async (category) => {
            const count = await Property.count({
                where: { category_id: category.id }
            });
            
            // Convert Sequelize instance to plain object and add count
            const plainCategory = category.get({ plain: true });
            return {
                ...plainCategory,
                propertiesCount: count
            };
        }));
        
        console.log('Categories with counts:', categoriesWithCounts.length);
        
        res.json(categoriesWithCounts);
    } catch (error) {
        console.error('Error fetching categories with counts:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};