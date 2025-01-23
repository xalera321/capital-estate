const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PropertyFeature extends Model {
        static associate(models) {
            // Ассоциации можно определить здесь при необходимости
        }
    }

    PropertyFeature.init({
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        feature_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PropertyFeature',
        tableName: 'PropertyFeatures',
        timestamps: false
    });

    return PropertyFeature;
};