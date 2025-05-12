const { Request, Property } = require('../models');

exports.createRequest = async (req, res) => {
    try {
        const { user_name, user_phone, message, property_id } = req.body;
        
        // Validate required fields
        if (!user_name) {
            return res.status(400).json({ error: 'Имя пользователя обязательно' });
        }
        
        if (!user_phone) {
            return res.status(400).json({ error: 'Номер телефона обязателен' });
        }
        
        // Create the request with or without property_id
        const request = await Request.create({
            user_name,
            user_phone,
            message: message || '',
            property_id: property_id || null // Make property_id optional
        });

        res.status(201).json({
            id: request.id,
            message: 'Заявка успешно создана'
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(400).json({ error: error.message });
    }
};

// Добавляем полный CRUD для заявок
exports.getRequests = async (req, res) => {
    try {
        console.log('Getting all requests');
        
        const requests = await Request.findAll({
            include: [{
                model: Property,
                as: 'property',
                attributes: ['id', 'title', 'price', 'address']
            }],
            order: [['createdAt', 'DESC']] // Newest first
        });
        
        console.log(`Successfully found ${requests.length} requests`);
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'in_progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const request = await Request.findByPk(id);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        await request.update({ status });
        res.json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        await request.destroy();
        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getRequestsCount = async (req, res) => {
    try {
        const count = await Request.count();
        res.json({ count });
    } catch (error) {
        console.error('Count error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};