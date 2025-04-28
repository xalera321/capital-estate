'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Admins', 'twoFactorSecret', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Admins', 'twoFactorEnabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Admins', 'twoFactorSecret');
    await queryInterface.removeColumn('Admins', 'twoFactorEnabled');
  }
}; 