'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
      'Projects',
      'risk_level',       
       {
        type: Sequelize.INTEGER,
        allowNull: false
      }
     ),
     queryInterface.addColumn(
      'Projects',
      'engineers_need',       
       {
        type: Sequelize.INTEGER,
        allowNull: false
      }
     ),
     queryInterface.addColumn(
      'Projects',
      'opportunities',       
       {
        type: Sequelize.STRING,
        allowNull: false
      }
     ),
     queryInterface.addColumn(
      'Projects',
      'pm_involvement',       
       {
        type: Sequelize.INTEGER,
        allowNull: false
      }
     ),]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn(
      'Projects',
      'risk_level'
    ),
    queryInterface.removeColumn(
      'Projects',
      'engineers_need'
    ),
    queryInterface.removeColumn(
      'Projects',
      'opportunities'
    ),
    queryInterface.removeColumn(
      'Projects',
      'pm_involvement'
    ),]);
  }
};
