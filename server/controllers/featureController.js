const { Feature } = require('../models');

// Get all features
exports.getFeatures = async (req, res) => {
    try {
        const features = await Feature.findAll({
            order: [['name', 'ASC']]
        });
        res.json(features);
    } catch (error) {
        console.error('Error fetching features:', error);
        res.status(500).json({ error: 'Failed to fetch features' });
    }
};

// Get feature count
exports.getFeaturesCount = async (req, res) => {
    try {
        const count = await Feature.count();
        res.json({ count });
    } catch (error) {
        console.error('Error counting features:', error);
        res.status(500).json({ error: 'Failed to count features' });
    }
};

// Create a new feature
exports.createFeature = async (req, res) => {
    try {
        const feature = await Feature.create(req.body);
        res.status(201).json(feature);
    } catch (error) {
        console.error('Error creating feature:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update a feature
exports.updateFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const feature = await Feature.findByPk(id);
        
        if (!feature) {
            return res.status(404).json({ error: 'Feature not found' });
        }
        
        await feature.update(req.body);
        res.json(feature);
    } catch (error) {
        console.error('Error updating feature:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a feature
exports.deleteFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const feature = await Feature.findByPk(id);
        
        if (!feature) {
            return res.status(404).json({ error: 'Feature not found' });
        }
        
        await feature.destroy();
        res.json({ message: 'Feature deleted successfully' });
    } catch (error) {
        console.error('Error deleting feature:', error);
        res.status(500).json({ error: 'Failed to delete feature' });
    }
}; 