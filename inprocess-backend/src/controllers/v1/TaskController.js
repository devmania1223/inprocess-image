'use strict';

const HttpStatus = require('http-status-codes');

const constants = require('../../config/constants');
const TaskRepository = require('../../repository/TaskRepository');

const taskRepository = new TaskRepository();

class TaskController {
    async createTask(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await taskRepository.createTask(
                req.body
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async findAllTasks(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await taskRepository.findAllTasks(
                req.body
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async findTaskByProject(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await taskRepository.findTaskByProject(
                { id: req.params.projectId }
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async findTaskById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await taskRepository.findTaskByFilter(
                { id: req.params.id }
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async updateTaskById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await taskRepository.updateTaskByFilter(
                req.body,
                { id: req.params.id }
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async deleteTaskById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await taskRepository.updateTaskByFilter(
                { isDelete: true },
                { id: req.params.id }
            );
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

module.exports = TaskController;
