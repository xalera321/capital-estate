// models/Feature.js
module.exports = (sequelize, DataTypes) => {
    class Feature extends sequelize.Model {
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
        paranoid: true // Добавлено мягкое удаление
    });

    return Feature;
};