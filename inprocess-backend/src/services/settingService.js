'use strict';
const moment = require('moment');
const Setting = require('../models').Setting;

class SettingSerive {
    async getSystemDate(){
        const userSetting = await Setting.findOne(
            {},
            { where: { isActive: true } }
        );
        return userSetting;
    }    

    async validateDateTime(startDate, endDate) {
        try {
            const currentDate = moment.utc();
            const userSetting = await Setting.findOne(
                {},
                { where: { isActive: true } }
            );
            if (userSetting && userSetting.dateOvveride) {
                const {
                    dayOfAMonth: date,
                    timeOfAMonth
                } = userSetting.dataValues;
                const hours = timeOfAMonth.getUTCHours();
                const minutes = timeOfAMonth.getUTCMinutes();
                const month = timeOfAMonth.getUTC
                const seconds = timeOfAMonth.getUTCSeconds();               
                const lastEditDate = moment().utc().set({
                    date,
                    hours,
                    minutes,
                    seconds
                });
            
                return !currentDate.isBefore(lastEditDate);
            }
            return true;
        } catch (error) {
            console.log('error message here we have ', error);
            return false;
        }
    }
}

module.exports = SettingSerive;
