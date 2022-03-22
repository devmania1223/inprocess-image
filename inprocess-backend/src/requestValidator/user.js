const Joi = require('@hapi/joi');

const method = (value, helpers) => {
    const isAlowed = value.includes('inprocessgroup.com');
    if (!isAlowed) {
        throw new Error('Email domain not allowed to join In-Process');
    }
    return value;
};

module.exports = {
    0: {
        path: {
            userId: Joi.number().required().description('Id of the User'),
            projectId: Joi.number().required().description('Id of the Project'),
            taskId: Joi.number().required().description('Id of the Task')
        },
        body: {
            isAssigned: Joi.boolean()
                .required()
                .description('This task assigned to User (ture/false)')
        },
        model: 'AssignUserTask',
        group: 'User',
        description: 'Assign task to user'
    },
    1: {
        path: {
            userId: Joi.number().required().description('Id of the User')
        },
        model: 'GetUserProject',
        group: 'User',
        description: 'API to get the User Project'
    },
    2: {
        path: {
            userId: Joi.number().required().description('Id of the User'),
            projectId: Joi.number().required().description('Id of the Project')
        },
        model: 'GetTaskProject',
        group: 'User',
        description: 'API to get task for an project'
    },
    3: {
        model: 'GetAllUser',
        group: 'User',
        description: 'API to get users list'
    },
    4: {
        body: {
            name: Joi.string().required().description('Name of the User'),
            email: Joi.string()
                .email()
                .required()
                .trim()
                .description('Email if the User')
                .custom(method),
        },
        path: {
            userId: Joi.number().required().description('Id of the User')
        },
        model: 'CreateUser',
        group: 'User',
        description: 'API to create the User'
    },
    5: {
        body: {
            name: Joi.string().required().description('Name of the User'),
            email: Joi.string()
                .email()
                .required()
                .trim()
                .description('Email if the User')
                .custom(method),
        },
        path: {
            userId: Joi.number().required().description('Id of the User')
        },
        model: 'UpdateUser',
        group: 'User',
        description: 'API to update the User'
    },
    6: {
        path: {
            userId: Joi.number().required().description('Id of the User')
        },
        model: 'DeleteUser',
        group: 'User',
        description: 'API to delete the User'
    },
    7: {
        path: {
            userIds: Joi.string().required().description('Id list of the User')
        },
        model: 'DeleteUsers',
        group: 'User',
        description: 'API to delete the Users'
    },
    8: {
        body: {
            password: Joi.string()
                .required()
                .min(8)
                .max(16)
                .description(
                    'Password is required minimum character is 8 required here'
            )
        },
        path: {
            userId: Joi.number().required().description('Id of the User')
        },
        model: 'ResetPassword',
        group: 'User',
        description: 'API to reset password'
    },
};
