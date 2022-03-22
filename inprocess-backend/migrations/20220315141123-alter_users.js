'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
      'Users',
      'role',       
       {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      }
     ),]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(queryInterface.removeColumn(
      'Users',
      'role'
    ));
  }
};
