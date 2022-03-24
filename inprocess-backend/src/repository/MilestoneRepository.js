const Milestone = require('../models').Milestone;
const sequelize = require('sequelize');
const attributes = { exclude: ['isDisable', 'isDelete'] };
class MilestoneRepository {
    async findAllByProjectId(filter) {
        filter.isDisable = false;
        filter.isDelete = false;
        const milestones = Milestone.findAll({
            where: filter,
            attributes: [
                'name', 
                'progress', 
                'projectId', 
                [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%m/%d/%Y'), 'date'], 
            ]
        });
        return milestones;
    }
   
}
module.exports = MilestoneRepository;
