'use strict';

const Task = require('../models').Task;
const ParentTasks = require('../models').ParentTasks;
const attributes = { exclude: ['isDisable', 'isDelete'] };

class TaskRepository {
    async createTask(data) {
        return await Task.create(data, { attributes });
    }

    async findAllTasks() {
        const filter = {
            isDisable: false,
            isDelete: false
        };
        let result = await ParentTasks.findAll({
            include: [
                {
                    model: Task,
                    where: filter,
                    required: false
                }
            ]
        });

        result = JSON.parse(JSON.stringify(result));

        result.map((item) => {
            item.isSelectable = !(item.Tasks && item.Tasks.length > 0);
        });

        return result;
    }

    async findTaskByFilter(filter) {
        filter.isDisable = false;
        filter.isDelete = false;
        return await Task.findAll({ where: filter, attributes });
    }

    async updateTaskByFilter(data, filter) {
        filter.isDisable = false;
        filter.isDelete = false;
        return await Task.update(data, { where: filter, attributes });
    }

    async findTaskByProject(data) {
        const task = await Task.findAll({
            where: { projectId: data.id }
        });
        return task;
    }
}
module.exports = TaskRepository;
