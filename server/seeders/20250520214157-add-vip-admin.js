'use strict';
const bcrypt = require('bcryptjs');

// Константы для нового администратора
const ADMIN_EMAIL = 'admin.kapitalned@mail.ru';
const ADMIN_PASSWORD = 'wic@RR1Fd43jq4sN';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Проверяем существование администратора
        const adminExists = await queryInterface.sequelize.query(
            `SELECT * FROM "Admins" WHERE email = '${ADMIN_EMAIL}' LIMIT 1`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT
            }
        );

        // Создаем администратора только если он не существует
        if (!adminExists.length) {
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            return queryInterface.bulkInsert('Admins', [{
                email: ADMIN_EMAIL,
                password: hashedPassword,
                twoFactorEnabled: false, // Начальное значение - 2FA не настроена
                twoFactorSecret: null, // Секрет будет установлен при настройке 2FA
                createdAt: new Date(),
                updatedAt: new Date()
            }]);
        }
    },

    async down(queryInterface, Sequelize) {
        // Удаляем только конкретного администратора
        return queryInterface.bulkDelete('Admins', {
            email: ADMIN_EMAIL
        });
    }
};