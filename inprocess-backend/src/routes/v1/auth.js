/* eslint-disable prettier/prettier */
'use strict';

const router = require('express').Router();

const { validation } = require('swagger-generator-express');

const authSchema = require('../../requestValidator/auth');
const AuthController = require('../../controllers/v1/AuthController');

const authController = new AuthController();

router.post('/register', validation(authSchema[0]), authController.register);
router.post('/login', validation(authSchema[1]), authController.login);
router.get('/email/verify', validation(authSchema[2]), authController.verifyToken);

module.exports = { router, basePath: '/api/v1/auth' };
