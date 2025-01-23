const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Feature extends Model {
        static associate(models) {
            this.belongsToMany(models.Property, {
                through: 'PropertyFeatures',
                as: 'properties',
                foreignKey: 'feature_id'
            });
        }
    }

    Feature.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Feature name must be unique'
            }
        }
    }, {
        sequelize,
        modelName: 'Feature',
        paranoid: true
    });

    return Feature;
};