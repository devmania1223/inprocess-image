'use strict';

module.exports = (sequelize, DataTypes) => {
    const Celoxis = sequelize.define(
        'Celoxis',
        {
            projectId: DataTypes.INTEGER,
            taskId : DataTypes.INTEGER,
            plannedStart: DataTypes.DATE,
            plannedFinish : DataTypes.DATE,
            plannedEffort: DataTypes.INTEGER,
            plannedDays : DataTypes.INTEGER
        },
        {}
    );
    Celoxis.associate = function (models) {
        Celoxis.belongsTo(models.Task, { foreignKey: 'taskId' });
        Celoxis.belongsTo(models.Project, { foreignKey: 'projectId' });
    };
    return Celoxis;
};
