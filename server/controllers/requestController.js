const { Request, Property } = require('../models');

exports.createRequest = async (req, res) => {
    try {
        const { user_name, user_phone, message, property_id } = req.body;

        const request = await Request.create({
            user_name,
            user_phone,
            message,
            property_id
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Добавляем полный CRUD для заявок
exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [
                {
                    model: Property,
                    attributes: ['id', 'title']
                }
            ]
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
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