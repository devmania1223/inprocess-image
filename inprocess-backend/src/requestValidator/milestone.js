const Joi = require('@hapi/joi');


module.exports = {    
    0: {
        path: {
            projectId: Joi.number().required().description('Id of the Project')
        },
        model: 'GetMilestones',
        group: 'Milestone',
        description: 'API to get the Project Milestones'
    },
};
