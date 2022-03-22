'use strict';
const CeloxisService = require('../services/celoxisService');

const celoxisService = new CeloxisService();

class CeloxisRepository {
    async saveCeloxisRecordsInDB() {
        return await celoxisService.saveCeloxisRecordsInDB();
    }

    async saveCeloxisRecordsInDBCron() {
        return await celoxisService.saveCeloxisRecordsInDBCron();
    }
}
module.exports = CeloxisRepository;
