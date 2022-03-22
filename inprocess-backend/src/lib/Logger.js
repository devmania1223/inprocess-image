const uid = require('gen-uid');
const Logger = require('../models').Logger;
const logRequestStart = (req, res, next) => {
    const requestId = uid.token(true).substr(0, 8);
    const version = req.get('X-ClientVersion');
    const platformVersion = req.get('X-ClientPlatformVersion');
    const device = req.get('X-ClientDevice');
    const locale = req.get('X-ClientLocale');
    const method = req.method;
    const originalUrl = req.originalUrl;
    const reqBody = JSON.stringify(req.body);
    const cleanup = () => {
        res.removeListener('finish', logFn);
        res.removeListener('close', abortFn);
        res.removeListener('error', errorFn);
    };

    const getLoggerForStatusCode = (statusCode) => {
        Logger.create({
            requestId,
            version,
            platformVersion,
            device,
            locale,
            method,
            originalUrl,
            reqBody,
            resStatusCode: res.statusCode,
            resMessage: res.statusMessage,
            resContentLength: res.get('Content-Length') || 0
        })
            .then((log) => {
                console.log('Request log saved');
            })
            .catch((err) => {
                console.error('Request log not saved', err);
            });
    };

    const logFn = () => {
        cleanup();
        getLoggerForStatusCode(res.statusCode);
    };

    const abortFn = () => {
        cleanup();
        console.warn('Request aborted by the client');
    };

    const errorFn = (err) => {
        cleanup();
        console.error(`Request pipeline error: ${err}`);
    };

    res.on('finish', logFn); // successful pipeline (regardless of its response)
    res.on('close', abortFn); // aborted pipeline
    res.on('error', errorFn); // pipeline internal error

    next();
};

module.exports = () => {
    return logRequestStart;
};
