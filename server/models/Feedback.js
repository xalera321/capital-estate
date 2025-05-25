const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
        static associate(models) {
            // При необходимости можно добавить связи
        }
    }

    Feedback.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Поле "Имя" обязательно для заполнения'
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^\+?[0-9]{7,15}$/,
                    msg: 'Некорректный формат телефона'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: 'Некорректный формат email'
                }
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Сообщение не может быть пустым'
                },
                len: {
                    args: [10, 2000],
                    msg: 'Сообщение должно содержать от 10 до 2000 символов'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('new', 'in_progress', 'resolved'),
            defaultValue: 'new',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Feedback',
        freezeTableName: true,
        paranoid: true,
        underscored: true,
        defaultScope: {
            attributes: { exclude: ['deletedAt'] }
        },
        scopes: {
            withDeleted: {
                paranoid: false
            }
        }
    });

    return Feedback;
};