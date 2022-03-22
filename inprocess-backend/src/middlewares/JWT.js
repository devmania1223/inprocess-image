const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

class JWT {
    generateToken(data) {
        const token = jwt.sign(
            {
                userId: data.id,
                firstName: data.firstName
            },
            constants.JWT.SECRET,
            { expiresIn: constants.JWT.EXPIRY_TIME }
        );
        return token;
    }

    async verifyToken(token) {
        const payload = jwt.verify(token, constants.JWT.SECRET);
        return payload;
    }
}

module.exports = JWT;
