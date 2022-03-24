const router = require('express').Router();
const { validation } = require('swagger-generator-express');

const MilestoneController = require('../../controllers/v1/MilestoneController');
const milestoneSchema = require('../../requestValidator/milestone');
const auth = require('../../middlewares/auth');

const milestoneController = new MilestoneController();

router.get(
    '/:projectId',
    auth,
    validation(milestoneSchema[0]),
    milestoneController.findAllByProjectId
);


module.exports = { router, basePath: '/api/v1/milestones' };
