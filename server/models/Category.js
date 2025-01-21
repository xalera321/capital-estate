// models/Category.js
module.exports = (sequelize, DataTypes) => {
    class Category extends sequelize.Model {
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
            unique: { msg: 'Категория с таким названием уже существует' }
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {
        sequelize,
        modelName: 'Category',
        paranoid: true // Добавлено мягкое удаление
    });

    return Category;
};