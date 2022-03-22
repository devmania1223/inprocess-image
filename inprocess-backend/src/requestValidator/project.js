const Joi = require('@hapi/joi');

module.exports = {
    0: {
        model: 'FindAllProject',
        group: 'Project',
        description: 'API to find all the Project'
    },
    1: {
        body: {
            name: Joi.string()
                .required()
                .trim()
                .description('Name of the project')
        },
        model: 'CreateProject',
        group: 'Project',
        description: 'API to create the project'
    },
    2: {
        path: {
            id: Joi.number().required().description('Id of the project')
        },
        model: 'FindProjectById',
        group: 'Project',
        description: 'API to find the project by Id'
    },
    3: {
        path: {
            id: Joi.number().required().description('Id of the project')
        },
        body: {
            name: Joi.string()
                .required()
                .trim()
                .description('Name of the project')
        },
        model: 'UpdateProjectById',
        group: 'Project',
        description: 'API to update the project by Id'
    },
    4: {
        path: {
            id: Joi.number().required().description('Id of the project')
        },
        model: 'DeleteProjectById',
        group: 'Project',
        description: 'API to delete the project by Id'
    },
    5: {
        path: {
            id: Joi.number().required().description('Id of the project')
        },
        body: {
            hoursProposed: Joi.number()
                .required()
                .description('Hours Proposed of the project'),
            comment: Joi.string()
                .required()
                .trim()
                .description('Comment for the project'),
            declaredIncome: Joi.number()
                .required()
                .description('Decloared Income of the project'),
            noOfAcutal: Joi.number()
                .required()
                .description('No of planned eng for the project'),
            type: Joi.string()
                .required()
                .trim()
                .description('Type for the project'),
            dcs: Joi.string()
                .required()
                .trim()
                .description('DCS for the project'),
            license_necessary: Joi.number()
                .required()
                .description('DCS for the project'),
            license: Joi.number().required().description('DCS for the project')
        },
        model: 'UpdateProject',
        group: 'Project',
        description: 'API to update a project'
    },
    6: {
        path: {
            id: Joi.number().required().description('Id of the project')
        },
        model: 'getProjectReportById',
        group: 'Project',
        description: 'API to get the project report by Id'
    },
    7: {
        path: {
            startDate: Joi.date()
                .required()
                .description('Start date of the project'),
            endDate: Joi.date()
                .required()
                .description('End date of the project')
        },
        model: 'getProjectReport',
        group: 'Project',
        description: 'API to get the project report'
    },
    8: {
        path: {
            startDate: Joi.date()
                .required()
                .description('Start date of the project'),
            endDate: Joi.date()
                .required()
                .description('End date of the project')
        },
        model: 'getProjectReportByUser',
        group: 'Project',
        description: 'API to get the project report by user name'
    },
    9: {
        model: 'getYearlyProjectReport',
        group: 'Project',
        description: 'API to get the yearly project report'
    },
    10: {
        path: {
            id: Joi.number().required().description('Id of the project'),
            type: Joi.number()
                .required()
                .description('Get data according to this type')
        },
        model: 'getProjectReportById',
        group: 'Project',
        description: 'API to get the project report by Id'
    },
    11: {
        path: {
            startDate: Joi.date()
                .required()
                .description('Start date of the project'),
            endDate: Joi.date()
                .required()
                .description('End date of the project'),
            id: Joi.number().required().description('Id of the project')
        },
        model: 'getProjectReportByManagerById',
        group: 'Project',
        description: 'API to get the project report by manager'
    },
    12: {
        path: {
            startDate: Joi.date()
                .required()
                .description('Start date of the project'),
            endDate: Joi.date()
                .required()
                .description('End date of the project'),
            id: Joi.number().required().description('Id of the project')
        },
        model: 'getProjectTaskReport',
        group: 'Project',
        description: 'API to get the project task report by project id'
    },
    13: {
        path: {
            startDate: Joi.date()
                .required()
                .description('Start date of the project'),
            endDate: Joi.date()
                .required()
                .description('End date of the project'),
            id: Joi.number().required().description('Start date of the project')
        },
        model: 'getProjectReportByUser',
        group: 'Project',
        description: 'API to get the project report by user name'
    },
    14: {
        model: 'getActiveProjectReport',
        group: 'Project',
        description: 'API to get all active project report'
    },
    15: {
        model: 'getMonthlyProjectReport',
        group: 'Project',
        description: 'API to get all current month project report'
    }
};
