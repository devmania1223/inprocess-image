/* eslint-disable prettier/prettier */
'use strict';

const router = require('express').Router();
const { validation } = require('swagger-generator-express');

const auth = require('../../middlewares/auth');
const CeloxisController = require('../../controllers/v1/CeloxisController');
const celoxisSchema = require("../../requestValidator/celoxis");

const celoxisController = new CeloxisController();

router.get('/', auth, validation(celoxisSchema[0]), celoxisController.saveCeloxisRecordsInDB);
router.get('/saveRecords', auth, validation(celoxisSchema[0]), celoxisController.saveCeloxisRecordsInDBCron);

module.exports = { router, basePath: '/api/v1/celoxis' };
