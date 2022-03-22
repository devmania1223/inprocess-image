'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserTask = sequelize.define(
        'UserTask',
        {
            projectId: DataTypes.INTEGER,
            taskId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            isAssigned: DataTypes.BOOLEAN,
            taskType: DataTypes.STRING(1)
        },
        {}
    );

    UserTask.associate = function (models) {
        UserTask.belongsTo(models.User, { foreignKey: 'userId' });
        UserTask.belongsTo(models.Project, { foreignKey: 'projectId' });
        UserTask.belongsTo(models.Task, { foreignKey: 'taskId' });
        UserTask.belongsTo(models.ParentTasks, { foreignKey: 'taskId' });
        UserTask.hasMany(models.Timesheet);
    };
    return UserTask;
};
