const HttpStatus = require('http-status-codes');
const TimeSheetRepository = require('../../repository/TimesheetRepository');
const constants = require('../../config/constants');
const { create, timesheets } = new TimeSheetRepository();

class TimesheetController {
    async create(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await create(req.userId, req.body);
            response.status = HttpStatus.CREATED;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async timesheets(req, res) {
        const response = { ...constants.defaultServerResponse };
        const data = {
            ...req.query,
            userId: req.userId
        };
        try {
            const responseFromRepository = await timesheets(data);
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
module.exports = TimesheetController;