const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            this.hasMany(models.Property, {
                foreignKey: 'category_id',
                as: 'properties'
            });
        }
    }

    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Category name must be unique'
            }
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {
        sequelize,
        modelName: 'Category',
        paranoid: true
    });

    return Category;
};