'use strict';

module.exports = (sequelize, DataTypes) => {
    const ParentTasks = sequelize.define(
        'ParentTasks',
        {
            name: DataTypes.STRING,
            isDisable: DataTypes.BOOLEAN,
            isDelete: DataTypes.BOOLEAN,
            projectId: DataTypes.INTEGER,
            celoxisId: DataTypes.NUMBER,
            plannedPercentComplete: DataTypes.INTEGER,
            actualPercentComplete: DataTypes.INTEGER,
            plannedEffort: DataTypes.NUMBER
        },
        {}
    );

    ParentTasks.associate = function (models) {
        ParentTasks.hasMany(models.UserTask);
        ParentTasks.hasMany(models.Celoxis);
        ParentTasks.hasMany(models.Task);
        ParentTasks.hasMany(models.Timesheet);
        ParentTasks.belongsTo(models.Project, { foreignKey: 'projectId' });
    };

    return ParentTasks;
};
