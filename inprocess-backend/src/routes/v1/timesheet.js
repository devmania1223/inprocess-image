const express = require('express');
const router = express.Router();
const { validation } = require('swagger-generator-express');
const auth = require('../../middlewares/auth');
const timesheetSchema = require('../../requestValidator/timesheet');

const TimesheetController = require('../../controllers/v1/TimesheetController');
const { create, timesheets } = new TimesheetController();

router.get('/v1/timesheet', auth, validation(timesheetSchema[0]), timesheets);
router.post('/v1/timesheet', auth, validation(timesheetSchema[1]), create);

module.exports = { router, basePath: '/api' };
