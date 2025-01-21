// models/Employee.js
module.exports = (sequelize, DataTypes) => {
    class Employee extends sequelize.Model {
        static associate(models) {
            this.hasMany(models.Request, {
                foreignKey: 'assigned_to',
                as: 'requests'
            });
        }
    }

    Employee.init({
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'ФИО сотрудника обязательно' },
                len: { args: [5, 255], msg: 'ФИО должно быть от 5 до 255 символов' }
            }
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Должность сотрудника обязательна' }
            }
        },
        phone: {
            type: DataTypes.STRING,
            validate: {
                is: { args: /^\+?[0-9]{7,15}$/, msg: 'Некорректный формат телефона' }
            }
        }
    }, {
        sequelize,
        modelName: 'Employee',
        paranoid: true
    });

    return Employee;
};