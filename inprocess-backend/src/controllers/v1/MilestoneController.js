const HttpStatus = require('http-status-codes');

const constants = require('../../config/constants');

const MilestoneRepository = require('../../repository/MilestoneRepository');

const milestoneRepository = new MilestoneRepository();

class MilestoneController {

    async findAllByProjectId(req, res) {
        const response = { ...constants.defaultServerResponse };
        try {
            const filter = {
                projectId: Number(req.params.projectId)
            };
            const responseFromRepository = await milestoneRepository.findAllByProjectId(
                filter
            );
            response.status = HttpStatus.OK;
            response.message = constants.controllerMessage.SUCCESS;
            response.body = responseFromRepository;
        } catch (error) {
            response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = error.message;
        }
        return res.status(response.status).send(response);
    }
}
module.exports = MilestoneController;
