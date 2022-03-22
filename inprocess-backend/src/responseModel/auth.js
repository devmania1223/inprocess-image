module.exports = {
    UserLogin: {
        200: {
            token: {
                type: 'string',
                example:
                    'buseyJhbGci9didhlknkca.emYtYjI1OS1mOWNjZDQ3NDc3b3JnYW5pc2F0aW9uSWQiOiI0MmI4NjQ1Mi1iMzUwLTRjNjktYTljNC04MGMyNWU1YmE0OTQiLCJkb21haW4iOiJtaW5kcGF0aCIsImlhdCI6MTU5OTA0OTg5NiwiZXhwIjoxNTk5MzA5MDk2fQ.rK7WbTIxHD-qoFX4J3IGkpNEVAgSsrzmbbyNu6oXXxw'
            },
            data: {
                type: 'object',
                example: {
                    id: 1,
                    email: 'jitesh@gmail.com',
                    firstName: 'jitesh',
                    Role: []
                }
            }
        },
        400: {
            errors: {
                type: 'object',
                example: {
                    messages: 'Bad Request'
                }
            }
        }
    },
    UserSignup: {
        200: {
            id: {
                type: 'number',
                example: 1
            },
            email: {
                type: 'string',
                example: 'josan8@gmail.com'
            },
            name: {
                type: 'string',
                example: 'philps'
            },
            updateAt: {
                type: 'string',
                example: '2020-10-29T12:02:29.441Z'
            },
            createdAt: {
                type: 'string',
                example: '2020-10-29T12:02:29.441Z'
            }
        }
    },
    VerifiyToken: {
        200: {
            message: {
                type: 'string',
                example: 'Email verify successfully'
            }
        }
    }
};
