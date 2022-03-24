'use strict';

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define(
        'Project',
        {
            name: DataTypes.STRING,
            isDisable: DataTypes.BOOLEAN,
            isDelete: DataTypes.BOOLEAN,
            hoursProposed: DataTypes.NUMBER,
            declaredIncome: DataTypes.NUMBER,
            risk: DataTypes.STRING,
            comment: DataTypes.STRING,
            priceHour: DataTypes.NUMBER,
            inporcessCost: DataTypes.NUMBER,
            startDate: DataTypes.DATE,
            celoxisEndDate: DataTypes.DATE,
            realBasedLine: DataTypes.NUMBER,
            plannedBasedLine: DataTypes.NUMBER,
            celoxisId: DataTypes.NUMBER,
            Description: DataTypes.TEXT,
            Client: DataTypes.STRING,
            Manager: DataTypes.STRING,
            plannedEffort: DataTypes.NUMBER,
            noOfAcutal: DataTypes.NUMBER,
            declaredProduction: DataTypes.NUMBER,
            effortBudgetFromProppsal: DataTypes.NUMBER,
            type: DataTypes.STRING,
            dcs: DataTypes.STRING,
            license_necessary: DataTypes.NUMBER,
            license: DataTypes.NUMBER,
            risk_level: DataTypes.NUMBER,
            engineers_need: DataTypes.NUMBER,
            opportunities: DataTypes.STRING,
            pm_involvement: DataTypes.NUMBER,
        },
        {}
    );

    Project.associate = function (models) {
        Project.hasMany(models.UserTask);
        Project.hasMany(models.Timesheet);
        Project.hasMany(models.Celoxis);
        Project.hasMany(models.Task);
        Project.hasMany(models.ParentTasks);
        Project.hasMany(models.Milestone);
    };

    return Project;
};
