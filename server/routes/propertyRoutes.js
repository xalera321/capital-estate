const express = require('express');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    toggleVisibility,
    uploadPhotos
} = require('../controllers/propertyController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', auth, createProperty);
router.post('/:id/photos', auth, upload.array('photos', 10), uploadPhotos);
router.put('/:id', auth, updateProperty);
router.delete('/:id', auth, deleteProperty);
router.patch('/:id/toggle-visibility', auth, toggleVisibility);

module.exports = router;