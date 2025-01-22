const { Property, PropertyPhoto, Feature } = require('../models');

exports.createProperty = async (req, res) => {
    try {
        const { features, ...propertyData } = req.body;

        const property = await Property.create(propertyData);

        if (features && features.length) {
            await property.addFeatures(features);
        }

        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
            type, // тип недвижимости (category name)
            minArea,
            maxArea,
            rooms,
            sortBy
        } = req.query;

        const where = { is_hidden: false };
        const include = [];
        const order = [];

        // Фильтр по типу операции
        if (operationType) where.operation_type = operationType;

        // Фильтр по цене
        if (minPrice || maxPrice) {
            where.price = {
                [Op.between]: [
                    minPrice || 0,
                    maxPrice || Number.MAX_SAFE_INTEGER
                ]
            };
        }

        // Фильтр по местоположению
        if (city) where.city = city;
        if (district) where.district = district;

        // Фильтр по типу недвижимости (категории)
        if (type) {
            include.push({
                model: Category,
                as: 'category',
                where: { name: type }
            });
        } else {
            include.push({ model: Category, as: 'category' });
        }

        // Фильтр по площади
        if (minArea || maxArea) {
            where.area = {
                [Op.between]: [
                    minArea || 0,
                    maxArea || Number.MAX_SAFE_INTEGER
                ]
            };
        }

        // Фильтр по количеству комнат
        if (rooms) where.rooms = rooms;

        // Фильтр по категории (ID)
        if (categoryId) where.category_id = categoryId;

        // Сортировка
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
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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