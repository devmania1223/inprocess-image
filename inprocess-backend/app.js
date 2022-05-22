require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swagger = require('swagger-generator-express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const HttpStatus = require('http-status-codes');
const Cron = require('./src/cron');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
});

const app = express();
app.use(helmet());
// enabling CORS for all requests
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

fs.readdirSync(path.resolve(__dirname, 'src', 'routes', 'v1')).forEach(
    (file) => {
        const { router, basePath } = require(path.resolve(
            __dirname,
            'src',
            'routes',
            'v1',
            file
        ));
        app.use(basePath, router);
    }
);

// -------------------------- Swagger ----------------------
/**
 * serveSwagger must be called after defining your router.
 * @param app Express object
 * @param endPoint Swagger path on which swagger UI display
 * @param options Swagget Options.
 * @param path.routePath path to folder in which routes files defined.
 * @param path.requestModelPath Optional parameter which is path to folder in which requestModel defined, if not given request params will not display on swagger documentation.
 * @param path.responseModelPath Optional parameter which is path to folder in which responseModel defined, if not given response objects will not display on swagger documentation.
 */
const options = {
    title: 'Inprocess swagger here',
    version: '1.0.0',
    host: process.env.API_URL,
    basePath: '/',
    schemes: ['http', 'https'],
    securityDefinitions: {
        Bearer: {
            description:
                'Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM',
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [{ Bearer: [] }],
    defaultSecurity: 'Bearer'
};
swagger.serveSwagger(app, '/swagger', options, {
    routePath: '/src/routes/v1',
    requestModelPath: '/src/requestValidator',
    responseModelPath: '/src/responseModel'
});

app.use(function (err, req, res, next) {
    const statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).send({
        status: err.statusText || HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
        code: err.code,
        errors: err.errors || {}
    });
});

(async () => {
    try {
        await Cron.start();
    } catch (error) {
        console.log(error);
    }
})();

module.exports = app;
