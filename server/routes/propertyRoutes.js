const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    toggleVisibility,
    uploadPhotos,
    getLatestProperties,
    getPropertiesCount
} = require('../controllers/propertyController');
const auth = require('../middlewares/auth');

// Получить все объекты
router.get('/', getProperties);
router.get('/count', getPropertiesCount);
router.get('/latest', getLatestProperties);
router.get('/count', getPropertiesCount);

// Получить конкретный объект
router.get('/:id', getPropertyById);

// Создать новый объект
router.post('/', auth, createProperty);

// Обновить объект
router.put('/:id', auth, updateProperty);

// Удалить объект
router.delete('/:id', auth, deleteProperty);

// Переключить видимость объекта
router.patch('/:id/toggle-visibility', auth, toggleVisibility);

// Загрузить фото для объекта
router.post('/:id/photos', auth, upload.array('photos', 10), uploadPhotos);

module.exports = router;