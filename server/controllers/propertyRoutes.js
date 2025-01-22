const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    createProperty,
    getProperties,
    uploadPhotos
} = require('../controllers/propertyController');
const auth = require('../middlewares/auth');

router.get('/', getProperties);
router.post('/', auth, createProperty);
router.post('/:id/photos', auth, upload.array('photos', 10), uploadPhotos);

module.exports = router;