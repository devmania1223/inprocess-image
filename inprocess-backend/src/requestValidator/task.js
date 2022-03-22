const Joi = require('@hapi/joi');

module.exports = {
    0: {
        model: 'FindAllTask',
        group: 'Task',
        description: 'API to find all the Task'
    },
    1: {
        body: {
            name: Joi.string().required().trim().description('Name of the task')
        },
        model: 'CreateTask',
        group: 'Task',
        description: 'API to create the task'
    },
    2: {
        path: {
            id: Joi.number().required().description('Id of the task')
        },
        model: 'FindTaskById',
        group: 'Task',
        description: 'API to find the task by Id'
    },
    3: {
        path: {
            id: Joi.number().required().description('Id of the task')
        },
        body: {
            name: Joi.string().required().trim().description('Name of the task')
        },
        model: 'UpdateTaskById',
        group: 'Task',
        description: 'API to update the task by Id'
    },
    4: {
        path: {
            id: Joi.number().required().description('Id of the task')
        },
        model: 'DeleteTaskById',
        group: 'Task',
        description: 'API to delete the task by Id'
    },
    5: {
        path: {
            projectId: Joi.number().required().description('ProjectId of the task')
        },
        model: 'FindTaskByProject',
        group: 'Task',
        description: 'API to find the task by Id'
    }
};
