module.exports = {
    TimeseetDetail: {
        200: {
            id: {
                type: 'number',
                example: 1
            },
            assignedTo: {
                type: 'number',
                example: 1
            },
            projects: {
                type: 'object',
                example: {
                    id: 1,
                    title: 'Ebotify',
                    description: 'AI ml bots',
                    isDisabled: false
                }
            },
            timesheets: {
                type: 'array',
                example: [
                    {
                        date: '2020-10-28',
                        timespent: '1'
                    },
                    {
                        date: '2020-10-29',
                        timespent: '7'
                    }
                ]
            }
        }
    },
    UpdateTimesheet: {
        201: {
            message: {
                type: 'string',
                example: 'timesheet updated Successfully'
            }
        }
    },
    TimeseetDetails: {
        200: {
            id: {
                type: 'number',
                example: 1
            },
            assignedTo: {
                type: 'number',
                example: 1
            },
            projects: {
                type: 'object',
                example: {
                    id: 1,
                    title: 'Ebotify',
                    description: 'AI ml bots',
                    isDisabled: false
                }
            },
            timesheets: {
                type: 'array',
                example: [
                    {
                        date: '2020-10-28',
                        timespent: '1'
                    },
                    {
                        date: '2020-10-29',
                        timespent: '7'
                    }
                ]
            }
        }
    }
};
