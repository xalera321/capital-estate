const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Property extends Model {
        static associate(models) {
            this.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
            });

            this.belongsToMany(models.Feature, {
                through: 'PropertyFeatures',
                as: 'features',
                foreignKey: 'property_id'
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
            validate: {
                len: {
                    args: [5, 255],
                    msg: 'Title must be between 5 and 255 characters'
                }
            }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Price must be greater than 0'
                }
            }
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
        district: DataTypes.STRING,
        area: {
            type: DataTypes.FLOAT,
            validate: {
                min: {
                    args: [0],
                    msg: 'Area cannot be negative'
                }
            }
        },
        rooms: {
            type: DataTypes.INTEGER,
            validate: {
                min: {
                    args: [0],
                    msg: 'Rooms cannot be negative'
                }
            }
        },
        floor: {
            type: DataTypes.INTEGER,
            validate: {
                min: {
                    args: [0],
                    msg: 'Floor cannot be negative'
                }
            }
        },
        total_floors: {
            type: DataTypes.INTEGER,
            validate: {
                min: {
                    args: [1],
                    msg: 'Total floors must be at least 1'
                }
            }
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
                        throw new Error('Invalid coordinates format');
                    }
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Property',
        paranoid: true,
        defaultScope: {
            where: { is_hidden: false }
        },
        scopes: {
            admin: {
                where: {}
            }
        }
    });

    return Property;
};