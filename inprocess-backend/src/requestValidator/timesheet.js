const Joi = require('@hapi/joi');

module.exports = {
    0: {
        query: {
            startDate: Joi.string()
                .optional()
                .description(
                    'Start date is required from which date you want to see the data'
                ),
            endDate: Joi.string()
                .optional()
                .description(
                    'EndDate is required date you want to see the data'
                )
        },
        model: 'TimeseetDetail',
        group: 'Timesheet',
        description: 'API to get timesheet'
    },
    1: {
        body: {
            timesheet: Joi.array()
                .items(
                    Joi.object({
                        projectId: Joi.number()
                            .integer()
                            .required()
                            .description('projectId is required here'),
                        taskId: Joi.number()
                            .integer()
                            .required()
                            .description('taskId is required here'),
                        date: Joi.string()
                            .required()
                            .description('date here is the required'),
                        isAssigned: Joi.boolean()
                            .required()
                            .description('isAssigned here is the required'),
                        timespent: Joi.number()
                            .required()
                            .description(
                                'no of hours thats spent on the projects'
                            ),
                        isDeleted: Joi.boolean()
                            .required()
                            .description('delete this Timesheet')
                    })
                )
                .required()
                .description('Array of the timesheet')
        },
        model: 'UpdateTimesheet',
        group: 'Timesheet',
        description: 'API to add the timesheet'
    }
};
