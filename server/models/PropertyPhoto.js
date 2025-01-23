const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PropertyPhoto extends Model {
        static associate(models) {
            this.belongsTo(models.Property, {
                foreignKey: 'property_id',
                as: 'property',
                onDelete: 'CASCADE'
            });
        }
    }

    PropertyPhoto.init({
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {
                    msg: 'Invalid URL format'
                }
            }
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: 'Order cannot be negative'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'PropertyPhoto',
        paranoid: true,
        defaultScope: {
            order: [['order', 'ASC']]
        }
    });

    return PropertyPhoto;
};