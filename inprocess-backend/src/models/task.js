'use strict';

module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define(
        'Task',
        {
            name: DataTypes.STRING,
            isDisable: DataTypes.BOOLEAN,
            isDelete: DataTypes.BOOLEAN,
            projectId: DataTypes.INTEGER,
            clientTaskId: DataTypes.INTEGER,
            celoxisId: DataTypes.NUMBER,
            ParentTaskId: DataTypes.INTEGER,
            ParentCelxiosId: DataTypes.INTEGER,
            plannedPercentComplete: DataTypes.INTEGER,
            actualPercentComplete: DataTypes.INTEGER,
            plannedEffort: DataTypes.NUMBER,
            sN: DataTypes.INTEGER
        },
        {}
    );

    Task.associate = function (models) {
        Task.hasMany(models.UserTask);
        Task.hasMany(models.Celoxis);
        Task.belongsTo(models.Project, { foreignKey: 'projectId' });
        Task.belongsTo(models.ParentTasks, { foreignKey: 'ParentTaskId' });
    };

    return Task;
};
