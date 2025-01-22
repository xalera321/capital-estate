// utils/validators.js
const Joi = require('joi');

exports.propertyFilterSchema = Joi.object({
    operationType: Joi.string().valid('rent', 'sale'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    city: Joi.string(),
    district: Joi.string(),
    categoryId: Joi.number(),
    type: Joi.string(),
    minArea: Joi.number().min(0),
    maxArea: Joi.number().min(0),
    rooms: Joi.number().integer().min(0),
    sortBy: Joi.string().valid('newest', 'price_asc', 'price_desc', 'area_asc', 'area_desc')
});