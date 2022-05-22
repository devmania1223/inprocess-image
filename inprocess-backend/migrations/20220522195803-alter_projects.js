'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn(
      'Projects',
      'risk_level',       
       {
        type: Sequelize.INTEGER,
        allowNull: true
      }
     ),
      queryInterface.changeColumn(
      'Projects',
      'engineers_need',       
       {
        type: Sequelize.INTEGER,
         allowNull: true
      }
     ),
      queryInterface.changeColumn(
      'Projects',
      'opportunities',       
       {
        type: Sequelize.STRING,
         allowNull: true
      }
     ),
      queryInterface.changeColumn(
      'Projects',
      'pm_involvement',       
       {
        type: Sequelize.INTEGER,
         allowNull: true
      }
     ),]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn(
      'Projects',
      'risk_level',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    ),
    queryInterface.changeColumn(
      'Projects',
      'engineers_need',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    ),
    queryInterface.changeColumn(
      'Projects',
      'opportunities',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    ),
    queryInterface.changeColumn(
      'Projects',
      'pm_involvement',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    ),]);
  }
};
