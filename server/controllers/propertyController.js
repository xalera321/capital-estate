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
           page = 1,
           limit = 12,
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
           features,
           sortBy,
           keyword
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
        
        if (features) {
            where['$features.id$'] = {
                [Op.in]: features.split(',')
            };
        }

        if (keyword) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${keyword}%` } },
                { description: { [Op.iLike]: `%${keyword}%` } },
                { address: { [Op.iLike]: `%${keyword}%` } }
            ];
        }

        const sortOptions = {
            newest: [['createdAt', 'DESC']],
            price_asc: [['price', 'ASC']],
            price_desc: [['price', 'DESC']],
            area_asc: [['area', 'ASC']],
            area_desc: [['area', 'DESC']]
        };

        order.push(sortOptions[sortBy] || sortOptions.newest);

        const total = await Property.count({
            where,
            include: [
                ...include,
                { model: Feature, as: 'features' }
            ]
        });

        const properties = await Property.findAll({
            offset: (page - 1) * limit,
            limit: parseInt(limit),
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

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            data: properties
        });
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

exports.getLatestProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: {
                is_hidden: false,
                operation_type: 'buy' // Пример фильтра
            },
            order: [['createdAt', 'DESC']],
            limit: 4,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: PropertyPhoto,
                    as: 'photos',
                    attributes: ['url'],
                    limit: 1
                }
            ]
        });
        res.json(properties);
    } catch (error) {
        console.error('Latest properties error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getPropertiesCount = async (req, res) => {
    try {
        const where = {
            is_hidden: false,
            operation_type: req.query.operationType || 'buy'
        };

        if (req.query.categoryId) {
            where.category_id = req.query.categoryId;
        }

        if (req.query.minPrice) {
            where.price = {
                ...where.price,
                [Op.gte]: Number(req.query.minPrice)
            };
        }

        if (req.query.maxPrice) {
            where.price = {
                ...where.price,
                [Op.lte]: Number(req.query.maxPrice)
            };
        }

        const count = await Property.count({ where });
        res.json({ count });
    } catch (error) {
        console.error('Count error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};