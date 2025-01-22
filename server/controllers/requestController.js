const { Request } = require('../models');

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