const HttpStatus = require('http-status-codes');

const moment = require("moment");

const constants = require('../../config/constants');
const UserTaskRepository = require('../../repository/UserTaskRepository');

const UserRepository = require('../../repository/UserRepository');

const userTaskRepository = new UserTaskRepository();

const userRepository = new UserRepository();

class UserController {
    async createUserTask(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const filter = {
                userId: Number(req.params.userId),
                projectId: Number(req.params.projectId),
                taskId: Number(req.params.taskId)
            };
            const responseFromRepository = await userTaskRepository.createUserTask(
                { ...filter, ...req.body },
                filter
            );
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

    async findAllUserProject(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const filter = {
                userId: Number(req.params.userId)
            };
            const responseFromRepository = await userTaskRepository.findAllUserProject(
                filter
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

    async findAllUserTask(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const filter = {
                userId: Number(req.params.userId),
                projectId: Number(req.params.projectId)
            };
            const responseFromRepository = await userTaskRepository.findAllUserTask(
                filter
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

    async findAllUserTaskByUserId(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const filter = {
                userId: Number(req.params.userId)
            };
            const responseFromRepository = await userTaskRepository.findAllUserTask(
                filter
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

    async findAllUser(_, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository = await userRepository.findAllUser();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async createUser(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {                     
            const responseFromRepository = await userRepository.createUser(
                {...req.body, password:'AAaa11!!', isEmailVerified: 1, token:'RYwhhRIFwLsGk3UJCnV_'}
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository.dataValues;
            response.body.createdAt = moment(response.body.createdAt).format('YYYY-MM-DD HH:mm:ss');
            response.body.updatedAt = moment(response.body.updatedAt).format('YYYY-MM-DD HH:mm:ss');
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async updateUser(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {  
            const filter = {
                id: Number(req.params.userId)
            };         
            const responseFromRepository = await userRepository.updateUser(
                filter, req.body
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository.dataValues;
            response.body.createdAt = moment(response.body.createdAt).format('YYYY-MM-DD HH:mm:ss');
            response.body.updatedAt = moment(response.body.updatedAt).format('YYYY-MM-DD HH:mm:ss');
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async deleteUser(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {                 
            await userRepository.deleteUser(
                {id: String(req.params.userId)}
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = req.params.userId;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async deleteUsers(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {  
            await userRepository.deleteUser(
                { id: String(req.body.ids).split(",")}
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = req.body.ids;
        } catch (error) {
            console.log(error);
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }
}
module.exports = UserController;
