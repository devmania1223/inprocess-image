'use strict';
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            isEmailVerified: DataTypes.BOOLEAN,
            token: DataTypes.STRING,
            timesheetLastUpdated: DataTypes.DATE,
            isDisable: DataTypes.BOOLEAN,
            isDelete: DataTypes.BOOLEAN,
            celoxisId: DataTypes.NUMBER,
            role: DataTypes.NUMBER,
        },
        {}
    );
    User.associate = function (models) { };
    User.beforeSave((user, options) => {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        return user;
    });
    User.beforeBulkUpdate(({ attributes, where }) => {
        if (attributes.password) {
            const hash = bcrypt.hashSync(attributes.password, 10);
            attributes.password = hash;
        }
        return attributes;
    });

    return User;
};
