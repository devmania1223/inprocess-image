'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Milestones', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            projectId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Projects',
                  key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            progress: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            isDisable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isDelete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};
