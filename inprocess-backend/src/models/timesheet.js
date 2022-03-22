'use strict';
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    const Timesheet = sequelize.define(
        'Timesheet',
        {
            userTaskId: DataTypes.INTEGER,
            userId : DataTypes.INTEGER,
            projectId: DataTypes.INTEGER,
            taskId : DataTypes.INTEGER,
            date: {
                type: DataTypes.DATEONLY,
                get: function () {
                    return moment
                        .utc(this.getDataValue('date'))
                        .format('YYYY-MM-DD');
                }
            },
            timespent: DataTypes.DECIMAL(10, 1),
            parentTaskId: DataTypes.INTEGER
        },
        {}
    );
    Timesheet.associate = function (models) {
        Timesheet.belongsTo(models.UserTask, { foreignKey: 'userTaskId' });
        Timesheet.belongsTo(models.Task, { foreignKey: 'taskId' });
        Timesheet.belongsTo(models.User, { foreignKey: 'userId' });
        Timesheet.belongsTo(models.Project, { foreignKey: 'projectId' });
        Timesheet.belongsTo(models.ParentTasks, { foreignKey: 'parentTaskId' });
    };
    return Timesheet;
};
