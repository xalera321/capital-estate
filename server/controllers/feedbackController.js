const { Feedback } = require('../models');

exports.createFeedback = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({ error: 'Имя обязательно' });
        }
        
        if (!message) {
            return res.status(400).json({ error: 'Сообщение обязательно' });
        }
        
        // Create feedback record
        const feedback = await Feedback.create({
            name,
            phone,
            email,
            message
        });

        res.status(201).json({
            id: feedback.id,
            message: 'Обратная связь успешно отправлена'
        });
    } catch (error) {
        console.error('Error creating feedback:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            order: [['createdAt', 'DESC']] // Newest first
        });
        
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

exports.getFeedbacksCount = async (req, res) => {
    try {
        const count = await Feedback.count();
        res.json({ count });
    } catch (error) {
        console.error('Count error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByPk(id);
        
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        
        await feedback.update(req.body);
        res.json(feedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id);
        
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        
        await feedback.destroy();
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 