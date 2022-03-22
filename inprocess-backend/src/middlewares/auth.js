const HttpStatus = require('http-status-codes');
const constants = require('../config/constants');
const JWT = require('./JWT');

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .send(constants.MESSAGES.INVALID_TOKEN);
        }
        const token = req.headers.authorization.split('Bearer')[1].trim();
        const jwt = new JWT();
        const payload = await jwt.verifyToken(token);
        req.userId = payload.userId;
        return next();
    } catch (error) {
        console.log("Check JWT", error);
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Unauthorized' });
    }
};
