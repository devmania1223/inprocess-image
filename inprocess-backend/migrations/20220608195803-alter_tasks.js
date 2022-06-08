'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
      'Tasks',
      'sN',       
       {
        type: Sequelize.INTEGER,
         defaultValue: 0,
        allowNull: false
      }
     ),]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn(
      'Tasks',
      'sN'
    ),]);
  }
};
