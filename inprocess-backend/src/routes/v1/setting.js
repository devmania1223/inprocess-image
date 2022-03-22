/* eslint-disable prettier/prettier */
'use strict';

const router = require('express').Router();
const { validation } = require('swagger-generator-express');

const auth = require('../../middlewares/auth');
const SettingController = require('../../controllers/v1/SettingController');
const settingSchema = require("../../requestValidator/setting");

const settingController = new SettingController();

router.get('/save', auth, validation(settingSchema[0]), settingController.saveDateLock);
router.get('/', auth, validation(settingSchema[1]), settingController.getSetting);

module.exports = { router, basePath: '/api/v1/setting' };
