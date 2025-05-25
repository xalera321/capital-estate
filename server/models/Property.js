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
                as: 'photos',
                onDelete: 'CASCADE'
            });

            this.hasMany(models.Request, {
                foreignKey: 'property_id',
                as: 'requests'
            });
        }
    }

    Property.init({
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
            type: DataTypes.ENUM('buy', 'rent'),
            allowNull: false,
            defaultValue: 'buy'
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district: DataTypes.STRING,
        address: DataTypes.STRING,
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
                    if (typeof value !== 'object' || value === null || 
                        typeof value.lat !== 'number' || typeof value.lng !== 'number') {
                        throw new Error('Invalid coordinates format');
                    }
                }
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            validate: {
                notNull: { msg: 'Категория обязательна для выбора' },
                notEmpty: { msg: 'Категория не может быть пустой' }
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