'use strict';

module.exports = (sequelize, DataTypes) => {
    const Milestone = sequelize.define(
        'Milestone',
        {
            projectId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            progress: DataTypes.INTEGER,
            date: DataTypes.DATE,
            invoiced: DataTypes.BOOLEAN,
            isDisable: DataTypes.BOOLEAN,
            isDelete: DataTypes.BOOLEAN,
        },
        {}
    );

    Milestone.associate = function (models) {
        Milestone.belongsTo(models.Project, { foreignKey: 'projectId' });
    };
    return Milestone;
};
