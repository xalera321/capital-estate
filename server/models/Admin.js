const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) { }

        validPassword(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }

    Admin.init({
        email: {
            type: DataTypes.STRING,
            unique: { msg: 'Email уже используется' },
            allowNull: false,
            validate: { isEmail: { msg: 'Некорректный формат email' } }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [8, 100], msg: 'Пароль должен быть от 8 до 100 символов' }
            }
        }
    }, {
        sequelize,
        modelName: 'Admin',
        paranoid: true,
        indexes: [{ unique: true, fields: ['email'] }],
        hooks: {
            beforeCreate: async (admin) => {
                admin.password = await bcrypt.hash(admin.password, 10);
            },
            beforeUpdate: async (admin) => {
                if (admin.changed('password')) {
                    admin.password = await bcrypt.hash(admin.password, 10);
                }
            }
        }
    });

    return Admin;
};