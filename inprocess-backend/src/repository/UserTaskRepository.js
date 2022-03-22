'use strict';

const UserTask = require('../models').UserTask;
const Project = require('../models').Project;
const Task = require('../models').Task;
const ParentTasks = require('../models').ParentTasks;


const attributes = {
    exclude: [
        'projectAssignedFromDate',
        'projectAssignedToDate',
        'ParentTaskId'
    ]
};
const projectAttributes = {
    exclude: ['isDisable', 'isDelete']
};

class UserTaskRepository {
    async createUserTask(data, filter) {
        const userTask = await UserTask.findOne({ where: filter, attributes });
        if (userTask) {
            return userTask;
        }
        return await UserTask.create(data);
    }

    async findAllUserProject(filter) {
        let projects = await Project.findAll({
            include: [
                {
                    model: UserTask,
                    where: filter,
                    attributes
                }
            ],
            attributes: projectAttributes
        });
        projects = JSON.parse(JSON.stringify(projects));
        projects.forEach((element) => {
            delete element.UserTasks;
        });
        return projects;
    }

    async findAllUserTask(filter) {
        const filters = {
            isDisable: false,
            isDelete: false
        };

        let tasks = await ParentTasks.findAll({
            include: [
                {
                    model: Task,
                    where: filters,
                    required: true,
                    include: [
                        {
                            model: UserTask,
                            where: filter,
                            attributes
                        }
                    ]
                }
            ],
            attributes: projectAttributes
        });
        tasks = JSON.parse(JSON.stringify(tasks));
        const TaskAr = [];
        tasks.forEach((element) => {
            TaskAr.push(element.id);
            element.isSelectable = !(element.Tasks && element.Tasks.length > 0);
            delete element.UserTasks;
        });

        filter.taskType = 'T';
        let tasks1 = await UserTask.findAll({
            include: {
                model: ParentTasks,
                where: filters
            },
            where: filter,
            attributes: ['taskId']
        });
        tasks1 = JSON.parse(JSON.stringify(tasks1));

        const newAr = [];
        for (let i = 0; i < tasks1.length; i++) {
            const parentTask = tasks1[i].ParentTask;
            if (TaskAr.indexOf(parentTask.id) < 0) {
                parentTask.isSelectable = true;
                parentTask.Tasks = [];
                await newAr.push(parentTask);
            }
        }
        tasks = newAr.concat(tasks);
        return tasks;
    }

    async userTask(data) {
        const task = await Task.findAll({
            where: { projectId: data.projectId }
        });
        return task;
    }
    
}
module.exports = UserTaskRepository;
