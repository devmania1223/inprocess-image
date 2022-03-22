'use strict';

const HttpStatus = require('http-status-codes');

const constants = require('../../config/constants');
const CeloxisRepository = require('../../repository/CeloxisRepository');

const celoxisRepository = new CeloxisRepository();

class CeloxisController {
    async saveCeloxisRecordsInDB(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await celoxisRepository.saveCeloxisRecordsInDB();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async saveCeloxisRecordsInDBCron(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await celoxisRepository.saveCeloxisRecordsInDBCron();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            console.log(error);
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }
}

module.exports = CeloxisController;
