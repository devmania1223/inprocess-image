const User = require('../models').User;
const sequelize = require('sequelize');
const attributes = { exclude: ['isDisable', 'isDelete'] };
class UserRepository {
    async findAllUser() {
        const filters = {
            isDisable: false,
            isDelete: false
        };
        const users = User.findAll({
            where: filters,
            attributes: [
                'name', 
                'id', 
                'email', 
                'role',
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'], 
                [sequelize.fn('DATE_FORMAT', sequelize.col('updatedAt'), '%Y-%m-%d %H:%i:%s'), 'updatedAt'], 
            ]
        });
        return users;
    }

    async createUser(data) {
        const userDetails = await User.create(data);
        if (userDetails) {
            delete userDetails.dataValues.password;
        }
        return userDetails;
    }

    async updateUser(filter, data) {
        filter.isDisable = false;
        filter.isDelete = false;
        await User.update(data, { where: filter, attributes });
        const userDetails = await User.findOne({
            where: filter,
            attributes: attributes
        });
        return userDetails;
    }

    async deleteUser(filter) {
        return await User.destroy({ where: filter });
    }

    async findUser(filter, attributes = ['id', 'password', 'email', 'name', 'role']) {
        const userDetails = await User.findOne({
            where: filter,
            attributes: attributes
        });
        return userDetails;
    }

    async findUserDetail(filter) {
        return await User.findOne({ where: filter });
    }

    async updateUserDetail(token) {
        const result = await User.update(
            { isEmailVerified: true },
            { where: { token } }
        );
        return result;
    }    
}
module.exports = UserRepository;
