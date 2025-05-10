// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middlewares/auth');

// Публичный маршрут для создания обратной связи
router.post('/', feedbackController.createFeedback);

// Защищенные маршруты (только для администраторов)
router.get('/', auth, feedbackController.getFeedbacks);
router.get('/count', auth, feedbackController.getFeedbacksCount);
router.put('/:id', auth, feedbackController.updateFeedback);
router.delete('/:id', auth, feedbackController.deleteFeedback);

module.exports = router; 