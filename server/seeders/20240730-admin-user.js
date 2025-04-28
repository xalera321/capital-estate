'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash password with 10 rounds of salting
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await queryInterface.bulkInsert('Admins', [{
      email: 'admin@capitalestate.com',
      password: hashedPassword,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Admins', { 
      email: 'admin@capitalestate.com' 
    }, {});
  }
}; 