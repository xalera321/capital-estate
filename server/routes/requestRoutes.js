// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middlewares/auth');

router.get('/', auth, requestController.getRequests);
router.post('/', requestController.createRequest);
router.put('/:id', auth, requestController.updateRequest);
router.delete('/:id', auth, requestController.deleteRequest);

module.exports = router;