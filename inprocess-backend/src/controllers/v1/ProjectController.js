'use strict';

const HttpStatus = require('http-status-codes');

const constants = require('../../config/constants');
const ProjectRepository = require('../../repository/ProjectRepository');

const projectRepository = new ProjectRepository();

class ProjectController {
    async createProject(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.createProject(req.body);
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async findAllProjects(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.findAllProjects(req.body);
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async findAllProjectsView(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.findAllProjectsView(req.body);
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async findProjectById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.findProjectByFilter({
                    id: req.params.id
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async updateProjectById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.updateProjectByFilter(req.body, {
                    id: req.params.id
                });
            console.log(req.body)
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async deleteProjectById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.updateProjectByFilter(
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

    async getProjectReportById(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectReportById({
                    id: req.params.id
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectReport(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectReport({
                    startDate: req.params.startDate,
                    endDate: req.params.endDate
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectReportByUser(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectReportByUser({
                    startDate: req.params.startDate,
                    endDate: req.params.endDate,
                    id: req.params.id
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectReportByManager(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectReportByManager({
                    startDate: req.params.startDate,
                    endDate: req.params.endDate
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectReportByManagerReport2(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectReportByManagerReport2({
                    startDate: req.params.startDate,
                    endDate: req.params.endDate,
                    id: req.params.id
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getYearlyProjectReport(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getYearlyProjectReport(req.params.year);
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getYearlyUserReport(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getYearlyUserReport(req.params.year);
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectReportByProjectId(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectReportByProjectId({
                    id: req.params.id,
                    type: parseInt(req.params.type)
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getReportProject(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getReportProject(req.body);
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectResourcesHours(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectResourcesHours();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getProjectTaskReport(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getProjectTaskReport({
                    startDate: req.params.startDate,
                    endDate: req.params.endDate,
                    id: req.params.id
                });
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }

    async getActiveProjectReport(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getActiveProjectReport();
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }
    async getMonthlyProjectReport(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const responseFromRepository =
                await projectRepository.getMonthlyProjectReport();
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

module.exports = ProjectController;
