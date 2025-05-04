const { Property, PropertyPhoto, Feature, Category } = require('../models');
const { Op } = require('sequelize');

exports.createProperty = async (req, res) => {
    try {
        const { features, photos, ...propertyData } = req.body;

        // Debug log to see what's being received
        console.log('Received property data:', JSON.stringify(propertyData, null, 2));
        
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
        console.error('Property validation error:', error);
        res.status(400).json({
            error: 'Validation Error',
            message: error.message,
            details: error.errors?.map(e => ({
                message: e.message,
                path: e.path,
                value: e.value
            })) || []
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
        const useAdminScope = req.query.admin === 'true' || req.path.includes('/admin/');
        
        // Use admin scope if admin query parameter is true or if accessed through admin route
        const scopeToUse = useAdminScope ? 'admin' : 'defaultScope';
        
        const property = await Property.scope(scopeToUse).findByPk(req.params.id, {
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
        console.error('Get property by ID error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { features, ...propertyData } = req.body;

        // Use the admin scope to find hidden properties too
        const property = await Property.scope('admin').findByPk(id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        await property.update(propertyData);

        if (features) {
            await property.setFeatures(features);
        }

        const updatedProperty = await Property.scope('admin').findByPk(id, {
            include: [
                { model: Category, as: 'category' },
                { model: Feature, as: 'features' },
                { model: PropertyPhoto, as: 'photos' }
            ]
        });

        res.json(updatedProperty);
    } catch (error) {
        console.error('Update property error:', error);
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
        const { categoryId } = req.query;
        
        // Build where clause
        const where = {
            is_hidden: false,
            operation_type: 'buy'
        };
        
        // Add category filter if categoryId is provided
        if (categoryId && categoryId !== 'all') {
            where.category_id = categoryId;
        }
        
        const properties = await Property.findAll({
            where,
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

exports.getPropertiesAdmin = async (req, res) => {
    try {
        const properties = await Property.scope('admin').findAll({
            include: [
                { model: Category, as: 'category' },
                {
                    model: PropertyPhoto,
                    as: 'photos',
                    attributes: ['url'],
                    order: [['order', 'ASC']]
                }
            ],
            order: [['updatedAt', 'DESC']]
        });
        
        res.json(properties);
    } catch (error) {
        console.error('Admin properties error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.exportProperties = async (req, res) => {
    try {
        // First, check if ExcelJS is installed
        let ExcelJS;
        try {
            ExcelJS = require('exceljs');
        } catch (err) {
            console.error('ExcelJS not found:', err);
            return res.status(500).json({ 
                error: 'ExcelJS library not installed. Run: npm install exceljs' 
            });
        }
        
        const properties = await Property.scope('admin').findAll({
            include: [
                { model: Category, as: 'category' },
                { model: Feature, as: 'features' }
            ],
            order: [['updatedAt', 'DESC']]
        });
        
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Объекты недвижимости');
        
        // Define columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Название', key: 'title', width: 30 },
            { header: 'Категория', key: 'category', width: 20 },
            { header: 'Цена', key: 'price', width: 15 },
            { header: 'Операция', key: 'operation_type', width: 15 },
            { header: 'Площадь', key: 'area', width: 12 },
            { header: 'Комнат', key: 'rooms', width: 10 },
            { header: 'Город', key: 'city', width: 20 },
            { header: 'Район', key: 'district', width: 20 },
            { header: 'Адрес', key: 'address', width: 30 },
            { header: 'Статус', key: 'is_hidden', width: 15 },
            { header: 'Создан', key: 'created_at', width: 15 },
            { header: 'Обновлен', key: 'updated_at', width: 15 }
        ];
        
        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        
        // Add rows from properties data
        properties.forEach(property => {
            const data = property.toJSON();
            worksheet.addRow({
                id: data.id,
                title: data.title,
                category: data.category?.name || '',
                price: data.price,
                operation_type: data.operation_type === 'buy' ? 'Продажа' : 'Аренда',
                area: data.area,
                rooms: data.rooms || '',
                city: data.city,
                district: data.district || '',
                address: data.address || '',
                is_hidden: data.is_hidden ? 'Скрыт' : 'Активен',
                created_at: new Date(data.createdAt).toLocaleDateString('ru-RU'),
                updated_at: new Date(data.updatedAt).toLocaleDateString('ru-RU')
            });
        });
        
        // Format price column as currency
        worksheet.getColumn('price').numFmt = '#,##0 ₽';
        
        // Format area column with units
        worksheet.getColumn('area').numFmt = '#,##0.0 "м²"';
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=properties-export.xlsx');
        
        // Write the workbook to the response
        await workbook.xlsx.write(res);
        
        // End the response
        res.end();
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getPropertiesByIds = async (req, res) => {
    try {
        const { ids } = req.query;
        
        if (!ids) {
            return res.status(400).json({ error: 'Property IDs are required' });
        }
        
        // Parse the IDs from the query string
        const propertyIds = ids.split(',').map(id => parseInt(id, 10));
        
        // Use admin scope to get all properties including hidden ones
        const properties = await Property.scope('admin').findAll({
            where: {
                id: {
                    [Op.in]: propertyIds
                }
            },
            include: [
                { model: Category, as: 'category' },
                { model: Feature, as: 'features' },
                {
                    model: PropertyPhoto,
                    as: 'photos',
                    attributes: ['url'],
                    order: [['order', 'ASC']]
                }
            ]
        });
        
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties by IDs:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};