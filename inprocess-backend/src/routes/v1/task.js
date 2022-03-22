/* eslint-disable prettier/prettier */
'use strict';

const router = require('express').Router();
const { validation } = require('swagger-generator-express');

const auth = require('../../middlewares/auth');
const taskSchema = require('../../requestValidator/task');
const TaskController = require('../../controllers/v1/TaskController');

const taskController = new TaskController();

router.get('/', auth, validation(taskSchema[0]), taskController.findAllTasks);
router.post('/', auth, validation(taskSchema[1]), taskController.createTask);
router.get('/:id', auth, validation(taskSchema[2]), taskController.findTaskById);
router.patch('/:id', auth, validation(taskSchema[3]), taskController.updateTaskById);
router.delete('/:id', auth, validation(taskSchema[4]), taskController.deleteTaskById);
router.get('/project/:projectId', auth, validation(taskSchema[5]), taskController.findTaskByProject);


module.exports = { router, basePath: '/api/v1/tasks' };
