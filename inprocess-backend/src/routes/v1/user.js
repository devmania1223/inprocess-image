const router = require('express').Router();
const { validation } = require('swagger-generator-express');

const UserController = require('../../controllers/v1/UserController');
const userSchema = require('../../requestValidator/user');
const auth = require('../../middlewares/auth');

const userController = new UserController();

router.post(
    '/:userId/projects/:projectId/tasks/:taskId',
    auth,
    validation(userSchema[0]),
    userController.createUserTask
);
router.get(
    '/:userId/projects',
    auth,
    validation(userSchema[1]),
    userController.findAllUserProject
);
router.get(
    '/:userId/projects/:projectId/tasks',
    auth,
    validation(userSchema[2]),
    userController.findAllUserTask
);
router.get(
    '/:userId/tasks',
    auth,
    validation(userSchema[1]),
    userController.findAllUserTaskByUserId
);
router.get('/', auth, validation(userSchema[3]), userController.findAllUser);

router.post(
    '/',
    auth,
    validation(userSchema[4]),
    userController.createUser
);

router.put(
    '/:userId',
    auth,
    validation(userSchema[5]),
    userController.updateUser
);

router.delete(
    '/:userId',
    auth,
    validation(userSchema[6]),
    userController.deleteUser
);

router.post(
    '/delete',
    auth,
    validation(userSchema[7]),
    userController.deleteUsers
);

router.post(
    '/:userId/resetPassword',
    auth,
    validation(userSchema[8]),
    userController.updateUser
);

module.exports = { router, basePath: '/api/v1/users' };
