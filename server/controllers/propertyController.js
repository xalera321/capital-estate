const { Property, PropertyPhoto, Feature, Category } = require('../models');
const { Op } = require('sequelize');

exports.createProperty = async (req, res) => {
    try {
        const { features, photos, ...propertyData } = req.body;

        const property = await Property.create(propertyData);

        if (features && features.length) {
            await property.addFeatures(features);
        }

        if (photos && photos.length) {
            const photosData = photos.map(url => ({ url, property_id: property.id }));
            await PropertyPhoto.bulkCreate(photosData);
        }

        const createdProperty = await Property.findByPk(property.id, {
            include: [
                { model: Category, as: 'category' },
                { model: Feature, as: 'features' },
                { model: PropertyPhoto, as: 'photos' }
            ]
        });

        res.status(201).json(createdProperty);
    } catch (error) {
        res.status(400).json({
            error: 'Validation Error',
            details: error.errors?.map(e => e.message)
        });
    }
};

exports.getProperties = async (req, res) => {
    try {
        const {
            operationType,
            minPrice,
            maxPrice,
            city,
            district,
            categoryId,
            type,
            minArea,
            maxArea,
            rooms,
            sortBy
        } = req.query;

        const where = { is_hidden: false };
        const include = [];
        const order = [];

        if (operationType) where.operation_type = operationType;
        if (minPrice || maxPrice) {
            where.price = {
                [Op.between]: [
                    minPrice || 0,
                    maxPrice || Number.MAX_SAFE_INTEGER
                ]
            };
        }
        if (city) where.city = city;
        if (district) where.district = district;
        if (categoryId) where.category_id = categoryId;

        if (type) {
            include.push({
                model: Category,
                as: 'category',
                where: { name: type }
            });
        } else {
            include.push({ model: Category, as: 'category' });
        }

        if (minArea || maxArea) {
            where.area = {
                [Op.between]: [
                    minArea || 0,
                    maxArea || Number.MAX_SAFE_INTEGER
                ]
            };
        }
        if (rooms) where.rooms = rooms;

        const sortOptions = {
            newest: [['createdAt', 'DESC']],
            price_asc: [['price', 'ASC']],
            price_desc: [['price', 'DESC']],
            area_asc: [['area', 'ASC']],
            area_desc: [['area', 'DESC']]
        };

        order.push(sortOptions[sortBy] || sortOptions.newest);

        const properties = await Property.findAll({
            where,
            include: [
                ...include,
                { model: Feature, as: 'features' },
                {
                    model: PropertyPhoto,
                    as: 'photos',
                    attributes: ['url'],
                    order: [['order', 'ASC']]
                }
            ],
            order
        });

        res.json(properties);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'category' },
                { model: Feature, as: 'features' },
                {
                    model: PropertyPhoto,
                    as: 'photos',
                    order: [['order', 'ASC']]
                }
            ]
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { features, ...propertyData } = req.body;

        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        await property.update(propertyData);

        if (features) {
            await property.setFeatures(features);
        }

        const updatedProperty = await Property.findByPk(id, {
            include: [
                { model: Category, as: 'category' },
                { model: Feature, as: 'features' },
                { model: PropertyPhoto, as: 'photos' }
            ]
        });

        res.json(updatedProperty);
    } catch (error) {
        res.status(400).json({
            error: 'Validation Error',
            details: error.errors?.map(e => e.message)
        });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        await property.destroy();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.toggleVisibility = async (req, res) => {
    try {
        // Используем admin scope для поиска
        const property = await Property.scope('admin').findByPk(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        property.is_hidden = !property.is_hidden;
        await property.save();

        res.json(property);
    } catch (error) {
        console.error('Toggle visibility error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.uploadPhotos = async (req, res) => {
    try {
        const files = req.files;
        const photos = files.map(file => ({
            url: `/uploads/${file.filename}`,
            property_id: req.params.id
        }));

        await PropertyPhoto.bulkCreate(photos);
        res.json({ message: 'Photos uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
};