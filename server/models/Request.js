const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Request extends Model {
        static associate(models) {
            this.belongsTo(models.Property, {
                foreignKey: 'property_id',
                as: 'property'
            });
        }
    }

    Request.init({
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Имя пользователя обязательно' }
            }
        },
        user_phone: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^\+?[0-9]{7,15}$/,
                    msg: 'Некорректный формат телефона'
                }
            }
        },
        message: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'Сообщение должно быть до 1000 символов'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('new', 'in_progress', 'completed'),
            defaultValue: 'new'
        }
    }, {
        sequelize,
        modelName: 'Request',
        paranoid: true,
        underscored: true
    });

    return Request;
};