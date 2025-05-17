'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Удаляем поле title из таблицы Properties
        await queryInterface.removeColumn('Properties', 'title');
    },

    async down(queryInterface, Sequelize) {
        // В случае отката миграции, восстанавливаем поле title
        await queryInterface.addColumn('Properties', 'title', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Объект недвижимости' // Устанавливаем базовое значение по умолчанию
        });
    }
};