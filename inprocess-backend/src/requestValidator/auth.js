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
        body: {
            name: Joi.string().required().description('Name of the User'),
            email: Joi.string()
                .email()
                .required()
                .trim()
                .description('Email if the User')
                .custom(method),
            password: Joi.string()
                .required()
                .min(8)
                .max(16)
                .description(
                    'Password is required minimum character is 8 required here'
                )
        },
        model: 'UserSignup',
        group: 'AUTH',
        description: 'API to signup user in system'
    },
    1: {
        body: {
            email: Joi.string()
                .email()
                .required()
                .trim()
                .description('Email is required here for login'),
            password: Joi.string()
                .required()
                .min(6)
                .description('Password is required for login')
        },
        model: 'UserLogin',
        group: 'AUTH',
        description: 'API to login user in system'
    },
    2: {
        query: {
            token: Joi.string().required().description('token is required here')
        },

        model: 'VerifiyToken',
        group: 'AUTH',
        description: 'API to verifiy  the token'
    }
};
