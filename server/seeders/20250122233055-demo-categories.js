'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('Categories', [
            { name: 'Квартиры', description: 'Квартиры в многоквартирных домах', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Дома', description: 'Частные дома и коттеджи', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Участки', description: 'Земельные участки', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Комнаты', description: 'Отдельные комнаты', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Коммерческая недвижимость', description: 'Офисы и магазины', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Гаражи', description: 'Гаражи и парковки', createdAt: new Date(), updatedAt: new Date() }
        ], {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};