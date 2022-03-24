module.exports = {
    GetMilestones: {
        200: [{
            name: {
                type: 'string',
                example: 'Milestone1'
            },
            progress: {
                type: 'number',
                example: '12'
            },
            date: {
                type: 'string',
                example: '03/17/2022'
            }
        },
        {
            name: {
                type: 'string',
                example: 'Milestone2'
            },
            progress: {
                type: 'number',
                example: '22'
            },
            date: {
                type: 'string',
                example: '03/27/2022'
            }
        },
        ]
    },
};
