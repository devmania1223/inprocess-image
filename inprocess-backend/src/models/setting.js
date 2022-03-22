'use strict';
module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define(
        'Setting',
        {
            dayOfAMonth: DataTypes.INTEGER,
            timeOfAMonth: DataTypes.DATE,
            isActive: DataTypes.BOOLEAN,
            dateOvveride: DataTypes.BOOLEAN
        },
        {}
    );
    Setting.associate = function (models) {
        // associations can be defined here
    };
    return Setting;
};
