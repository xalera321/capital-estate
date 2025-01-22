'use strict';
const bcrypt = require('bcryptjs');

// Константы для удобства управления
const ADMIN_EMAIL = 'akuzmenko938@gmail.com';
const ADMIN_PASSWORD = 's@B@kA9yobW7meg'; // На продакшене храните в .env

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