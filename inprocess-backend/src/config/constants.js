module.exports = {
    defaultServerResponse: {
        status: 400,
        message: '',
        body: {}
    },
    controllerMessage: {
        SUCCESS: 'Success',
        FORBIDDEN: "You don't have permission to insert this records"
    },
    validationMessage: {
        BAD_REQUEST: 'Invalid fields',
        TOKEN_MISSING: 'Token missing from header',
        DUPLICATE_EMAIL: 'User already exist with given email',
        USER_NOT_FOUND: 'User not found',
        INVALID_PASSWORD: 'Incorrect Password',
        NO_DATA_AVALIBLE: 'No Data Avalible'
    },
    MESSAGES: {
        LOGIN_SUCCESS: 'User has been logged in successfully',
        USER_NOT_FOUND: 'User does not exist',
        INVALD_PASSWORD: 'Invalid password !!',
        REGISTER_SUCCESS: 'User created successfully!!!',
        PASSWORD_NOT_MATCH: '  Password and confirmPassword is not same',
        EMAIL_ALREADY_EXIST: 'Email already exists',
        INVALID_TOKEN: 'Invalid token',
        EMAIL_NOT_VERIFIED: 'Email not verified',
        EMAIL_VERIFIY: 'Email successfully verified',
        TOKEN_EXPIRED: 'Token Expired'
    },
    CODES: {
        LOGIN_SUCCESS: 'LOGIN_SUCCESS',
        USER_NOT_FOUND: 'USER_NOT_FOUND',
        INVALD_PASSWORD: 'INVALD_PASSWORD',
        REGISTER_SUCCESS: 'REGISTER_SUCCESS',
        INVALID_MAIL: 'INVALID_MAIL',
        EMAIL_NOT_VERIFIED: 'Email is not verified',
        TOKEN_EXPIRED: 'Token Expired'
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'thisistestsecretkey',
        EXPIRY_TIME: process.env.JWT_EXPIRY_TIME || '365d'
    },
    CELXIOS: {
        BEARER_TOKEN: process.env.CELXIOS_BEARER_TOKEN,
        API_BASE_URL: process.env.CELXIOS_API_BASE_URL,
        CRON_TIME_INTERVAL: process.env.CELXIOS_CRON_TIME_INTERVAL || 86400000
    },
    USER: {
        DEFAULT_PASSWORD: '123456'
    }
};
