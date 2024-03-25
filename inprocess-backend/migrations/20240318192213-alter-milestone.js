'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
      'Milestones',
      'invoiced',       
       {
        type: Sequelize.BOOLEAN,
         defaultValue: 0,
        allowNull: false
      }
     ),]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn(
      'Milestones',
      'invoiced'
    ),]);
  }
};
