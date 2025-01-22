// models/Property.js
const { Model } = require('sequelize'); // Добавляем импорт Model

module.exports = (sequelize, DataTypes) => {
    class Property extends Model { // Исправляем наследование
        static associate(models) {
            this.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
            });
            this.belongsToMany(models.Feature, {
                through: 'PropertyFeatures',
                as: 'features'
            });
            this.hasMany(models.PropertyPhoto, {
                foreignKey: 'property_id',
                as: 'photos'
            });
            this.hasMany(models.Request, {
                foreignKey: 'property_id',
                as: 'requests'
            });
        }
    }

    Property.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: { args: [5, 255], msg: 'Название должно быть от 5 до 255 символов' } }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: { args: [1], msg: 'Цена должна быть больше 0' } }
        },
        area: {
            type: DataTypes.FLOAT,
            validate: { min: { args: [0], msg: 'Площадь не может быть отрицательной' } }
        },
        rooms: {
            type: DataTypes.INTEGER,
            validate: { min: { args: [0], msg: 'Количество комнат не может быть отрицательным' } }
        },
        floor: {
            type: DataTypes.INTEGER,
            validate: { min: { args: [0], msg: 'Этаж не может быть отрицательным' } }
        },
        total_floors: {
            type: DataTypes.INTEGER,
            validate: { min: { args: [1], msg: 'Общее количество этажей должно быть не менее 1' } }
        },
        operation_type: {
            type: DataTypes.ENUM('rent', 'sale'),
            allowNull: false,
            defaultValue: 'sale'
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district: {
            type: DataTypes.STRING
        },
        description: DataTypes.TEXT,
        is_hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        coordinates: {
            type: DataTypes.JSONB,
            validate: {
                isValid(value) {
                    if (typeof value !== 'object' || !value?.lat || !value?.lng) {
                        throw new Error('Координаты должны быть объектом с полями lat и lng');
                    }
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Property',
        defaultScope: { where: { is_hidden: false } },
        scopes: { admin: { where: {} } },
        indexes: [
            { fields: ['price'] },
            { fields: ['area'] },
            { fields: ['rooms'] }
        ],
        paranoid: true
    });

    return Property;
};