// models/PropertyPhoto.js
module.exports = (sequelize, DataTypes) => {
    class PropertyPhoto extends sequelize.Model {
        static associate(models) {
            this.belongsTo(models.Property, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE'
            });
        }
    }

    PropertyPhoto.init({
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isUrl: { msg: 'Некорректный URL фотографии' } }
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: { args: [0], msg: 'Порядок не может быть отрицательным' } }
        }
    }, {
        sequelize,
        modelName: 'PropertyPhoto',
        tableName: 'property_photos',
        timestamps: true,
        paranoid: true
    });

    return PropertyPhoto;
};