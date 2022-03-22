'use strict';
const Setting = require('../models').Setting;

class SettingRepository {

    async getSetting () {
        const setting = await Setting.findOne({}, ['dateOvveride']);
        return JSON.parse(JSON.stringify(setting));
    } 

    async saveDateLock () {
        let setting = await Setting.findOne({}, ['dateOvveride']);
        setting = JSON.parse(JSON.stringify(setting));
        return await Setting.update({dateOvveride: !setting.dateOvveride}, { where: {isActive: true}});
    } 

}
module.exports = SettingRepository;
