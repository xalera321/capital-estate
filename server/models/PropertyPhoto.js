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
                isValidUrl(value) {
                    // Accept both full URLs and server paths starting with /uploads/
                    if (!value || 
                        !(value.startsWith('http://') || 
                          value.startsWith('https://') ||
                          value.startsWith('/uploads/'))) {
                        throw new Error('Invalid URL format');
                    }
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