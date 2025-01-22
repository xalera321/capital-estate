// models/Feature.js
const { Model } = require('sequelize'); // Добавляем импорт

module.exports = (sequelize, DataTypes) => {
    class Feature extends Model { // Исправляем наследование
        static associate(models) {
            this.belongsToMany(models.Property, {
                through: 'PropertyFeatures',
                as: 'properties'
            });
        }
    }

    Feature.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Особенность с таким названием уже существует' },
            validate: { notEmpty: { msg: 'Название особенности обязательно' } }
        }
    }, {
        sequelize,
        modelName: 'Feature',
        paranoid: true
    });

    return Feature;
};