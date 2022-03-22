const CeloxisService = require('../services/celoxisService');
const wait = require('../helper');
const constant = require('../config/constants');

module.exports = class Cron {
    static async start() {
        const _CeloxisService = new CeloxisService();
        const _interval = constant.CELXIOS.CRON_TIME_INTERVAL;
        while (1) {
            try {
                await _CeloxisService.saveCeloxisRecordsInDBCron();
                console.log(`Waiting for ${_interval}​​​​​​​​ ms`);
                await wait(_interval);
            } catch (error) {
                console.log(`Waiting for ${_interval}​​​​​​​​ ms`);
                console.log(error);
                await wait(_interval);
            }
        }
    }
}
