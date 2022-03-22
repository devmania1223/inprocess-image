/* eslint-disable prettier/prettier */
'use strict';

const router = require('express').Router();
const { validation } = require('swagger-generator-express');

const auth = require('../../middlewares/auth');
const projectSchema = require('../../requestValidator/project');
const ProjectController = require('../../controllers/v1/ProjectController');

const projectController = new ProjectController();

router.get(
    '/',
    auth,
    validation(projectSchema[0]),
    projectController.findAllProjects
);
router.post(
    '/',
    auth,
    validation(projectSchema[1]),
    projectController.createProject
);
router.get(
    '/projectMonthlyReport',
    auth,
    validation(projectSchema[15]),
    projectController.getMonthlyProjectReport
);
router.get(
    '/yearlyProjectReport/:year',
    validation(projectSchema[9]),
    projectController.getYearlyProjectReport
);
router.get(
    '/yearlyUserReport/:year',
    validation(projectSchema[9]),
    projectController.getYearlyUserReport
);
router.post(
    '/reportGeneration',
    validation(projectSchema[9]),
    projectController.getReportProject
);
router.get(
    '/getActiveProjectReport',
    auth,
    validation(projectSchema[14]),
    projectController.getActiveProjectReport
);
router.get(
    '/getProjectResourcesHours',
    auth,
    validation(projectSchema[9]),
    projectController.getProjectResourcesHours
);
router.get(
    '/:id',
    auth,
    validation(projectSchema[2]),
    projectController.findProjectById
);
router.patch(
    '/:id',
    auth,
    validation(projectSchema[3]),
    projectController.updateProjectById
);
router.delete(
    '/:id',
    auth,
    validation(projectSchema[4]),
    projectController.deleteProjectById
);
router.put(
    '/:id',
    auth,
    validation(projectSchema[5]),
    projectController.updateProjectById
);
router.get(
    '/reports/:id',
    auth,
    validation(projectSchema[6]),
    projectController.getProjectReportById
);
router.get(
    '/report/:startDate/:endDate',
    auth,
    validation(projectSchema[7]),
    projectController.getProjectReport
);
router.get(
    '/reportByUser/:startDate/:endDate/:id',
    auth,
    validation(projectSchema[13]),
    projectController.getProjectReportByUser
);
router.get(
    '/getProjectReportByManager/:startDate/:endDate',
    auth,
    validation(projectSchema[8]),
    projectController.getProjectReportByManager
);
router.get(
    '/getProjectReportByManagerById/:startDate/:endDate/:id',
    auth,
    validation(projectSchema[11]),
    projectController.getProjectReportByManagerReport2
);
router.get(
    '/getProjectTaskReport/:startDate/:endDate/:id',
    auth,
    validation(projectSchema[12]),
    projectController.getProjectTaskReport
);
router.get(
    '/projectReport/:id/:type',
    auth,
    validation(projectSchema[10]),
    projectController.getProjectReportByProjectId
);

module.exports = { router, basePath: '/api/v1/projects' };
