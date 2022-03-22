const HttpStatus = require('http-status-codes');
const cryptoRandomString = require('crypto-random-string');
const bcrypt = require('bcryptjs');

const constants = require('../../config/constants');
const UserRepository = require('../../repository/UserRepository');
const JWT = require('../../middlewares/JWT');
const mail = require('../../helper/mailHelper');
const userRepository = new UserRepository();

class AuthController {
    async register(req, res) {
        try {
            const { email } = req.body;
            const checkMail = await userRepository.findUser({ email: email });
            if (checkMail) {
                return res.status(HttpStatus.CONFLICT).json({
                    message: constants.MESSAGES.EMAIL_ALREADY_EXIST,
                    code: constants.CODES.INVALID_MAIL
                });
            }
            req.body.token = cryptoRandomString({
                length: 20,
                type: 'url-safe'
            });
            const user = await userRepository.createUser(req.body);
            await mail.emailHelper(user);
            delete user.dataValues.token;
            return res.status(HttpStatus.CREATED).json({
                body: user,
                message: constants.MESSAGES.REGISTER_SUCCESS
            });
        } catch (error) {
            console.log(error);
            const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).send({
                message: error.message,
                code: error.code,
                errors: error.errors || {}
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            let user = await userRepository.findUser({ email }, [
                'id',
                'password',
                'email',
                'name',
                'role'
            ]);
            if (!user) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: constants.MESSAGES.USER_NOT_FOUND,
                    code: constants.CODES.USER_NOT_FOUND
                });
            }
            const verify = await userRepository.findUserDetail({ email });
            if (!verify.isEmailVerified) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: constants.MESSAGES.INVALID_MAIL,
                    code: constants.CODES.EMAIL_NOT_VERIFIED
                });
            }
            const isValid = await bcrypt.compare(password, user.password);
		
            if (isValid) {
                user = user.dataValues;
                const token = new JWT().generateToken(user);
                delete user.password;
                return res.status(HttpStatus.OK).json({
                    token: token,
                    data: user,
                    message: constants.MESSAGES.LOGIN_SUCCESS
                });
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: constants.MESSAGES.INVALD_PASSWORD,
                    code: constants.CODES.INVALD_PASSWORD
                });
            }
        } catch (error) {
            const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).send({
                message: error.message,
                code: error.code,
                errors: error.errors || {}
            });
        }
    }

    async verifyToken(req, res) {
        try {
            const user = await userRepository.findUserDetail(req.query);
            if (!user) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: constants.MESSAGES.INVALID_TOKEN,
                    code: constants.CODES.USER_NOT_FOUND
                });
            }
            if (user.isEmailVerified) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: constants.MESSAGES.TOKEN_EXPIRED,
                    code: constants.CODES.TOKEN_EXPIRED
                });
            }
            user.isEmailVerified = true;
            await userRepository.updateUserDetail(user.token);
            return res.status(HttpStatus.OK).json({
                message: constants.MESSAGES.EMAIL_VERIFIY
            });
        } catch (error) {
            const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).send({
                message: error.message,
                code: error.code,
                errors: error.errors || {}
            });
        }
    }
}

module.exports = AuthController;
