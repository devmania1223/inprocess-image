'use strict';

const HttpStatus = require('http-status-codes');

const constants = require('../../config/constants');
const SettingRepository = require('../../repository/SettingRepository');

const SettingRepositori = new SettingRepository();

class SettingController {
    async saveDateLock(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await SettingRepositori.saveDateLock();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getSetting(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await SettingRepositori.getSetting();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }
}

module.exports = SettingController;
