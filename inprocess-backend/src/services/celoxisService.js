'use strict';

const axiosHelper = require('../helper/axiosHelper');
const constant = require('../config/constants');
const cryptoRandomString = require('crypto-random-string');
const momant = require('moment');

const Celoxis = require('../models').Celoxis;
const Task = require('../models').Task;
const Project = require('../models').Project;
const User = require('../models').User;
const UserTask = require('../models').UserTask;
const ParentTasks = require('../models').ParentTasks;
const DB = require('../models');
const { async } = require('crypto-random-string');
const { Op } = require('sequelize');

const projectUrl = 'projects?expand=manager,clients&';
const userUrl = 'users?';
const taskUrl = 'tasks?expand=project,assignments,parent&';

module.exports = class CeloxisService {
    fetchDataFromCelxios = async (url) => {
        let currentPage = 0,
            celxiosData = [];
        while (currentPage !== undefined && currentPage !== null) {
            console.log(`${constant.CELXIOS.API_BASE_URL}${url}page=${currentPage}`);
            const axiosResponse = await axiosHelper.AxiosApiCall(`${constant.CELXIOS.API_BASE_URL}${url}page=${currentPage}`);
            const { data, nextPage } = axiosResponse.data;
            celxiosData = celxiosData.concat(data);
            currentPage = nextPage;
        }
        return celxiosData;
    };

    fetchSingleDataFromCelxios = async (url) => {
        const axiosResponse = await axiosHelper.AxiosApiCall(`${constant.CELXIOS.API_BASE_URL}${url}`);
        return axiosResponse.data.data;
    }

    getUserAssignmentDataFromCelxios = async (id, obj = {}) => {
        const axiosResponse = await axiosHelper.AxiosApiCall(`${constant.CELXIOS.API_BASE_URL}taskAssignments/${id}/resource`, obj);
        const { data } = axiosResponse.data;
        return data;
    };

    getAllProjectFromCeloxis = async () => {
        const projects = await this.fetchDataFromCelxios(projectUrl);
        if (Array.isArray(projects) && projects.length) {
            const Proj = await Promise.all(
                projects.map((res) => {
                    const data = {
                        celoxisEndDate: res.projectedFinish ? momant(res.projectedFinish).format('YYYY-MM-DD h:mm:ss') : momant().format('YYYY-MM-DD h:mm:ss'),
                        realBasedLine: res.actualPercentComplete ? res.actualPercentComplete : 0,
                        plannedBasedLine: res.plannedPercentComplete ? res.plannedPercentComplete : 0
                    };
                    this.updateInprocessProjectById(res.name, data);
                })
            );
        }
    };

    getAllTasksFromCeloxis = async () => {
        const tasks = await this.fetchDataFromCelxios(taskUrl);
        if (Array.isArray(tasks) && tasks.length) {
            tasks = tasks.map((celoxisTask) => {
                if (celoxisTask) {
                    const taskName = celoxisTask.name;
                    const projectName = celoxisTask.project.data.name;
                    const plannedStart = momant(celoxisTask.plannedStart).utc();
                    const plannedFinish = momant(celoxisTask.plannedFinish).utc();
                    const plannedEffort = Number(celoxisTask.plannedEffort);
                    const plannedDays = plannedEffort > 0 ? momant(plannedFinish).diff(plannedStart, 'days') : 0;
                    return { projectName, taskName, plannedStart, plannedFinish, plannedEffort, plannedDays };
                }
            });
        }
        return tasks;
    };

    getTaskDataFromCelxios = async (id) => {
        const taskUrl = `tasks/${id}?expand=project,assignments,parent&`
        const task = await this.fetchDataFromCelxios(taskUrl);
        return task;
    }

    formatCeloxisTasks = async (celoxisTasks) => {
        let formatTasks = [];
        celoxisTasks.map((celoxisTask) => {
            const { id, projectName, taskName, plannedStart, plannedFinish, plannedEffort } = celoxisTask;
            if (plannedEffort > 0) {
                if (plannedStart.month() === plannedFinish.month() && plannedStart.year() === plannedFinish.year()) {
                    formatTasks.push(celoxisTask);
                } else {
                    while (plannedStart.isBefore(plannedFinish)) {
                        let setPlannedStart = momant(plannedStart);
                        let setPlannedFinish, setPlannedEffort, setPlannedDays;
                        if (plannedStart.date() !== 1 && plannedFinish.date() !== 1) {
                            setPlannedDays = plannedStart.daysInMonth() - plannedStart.date();
                            setPlannedFinish = momant(setPlannedStart).add(setPlannedDays, 'days');
                            setPlannedEffort = setPlannedDays * 8;
                            plannedStart.subtract(plannedStart.date() - 1, 'days');
                        } else if (plannedStart.month() === plannedFinish.month() && plannedStart.year() === plannedFinish.year()) {
                            setPlannedDays = momant(plannedFinish).diff(plannedStart, 'days') + 1;
                            setPlannedFinish = plannedFinish;
                            setPlannedEffort = setPlannedDays * 8;
                        } else {
                            setPlannedDays = plannedStart.daysInMonth();
                            setPlannedFinish = momant(setPlannedStart).add(setPlannedDays - 1, 'days');
                            setPlannedEffort = setPlannedDays * 8;
                        }
                        formatTasks.push({ id, projectName, taskName, plannedStart: setPlannedStart, plannedFinish: setPlannedFinish, plannedEffort: setPlannedEffort, plannedDays: setPlannedDays });
                        plannedStart.add(1, 'month');
                    }
                }
            } else {
                formatTasks.push(celoxisTask);
            }
        });
        celoxisTasks = await Promise.all(formatTasks.map((formatTask) => this.addInprocessProjectAndTaskId(formatTask)));
        return celoxisTasks.filter((celoxisTask) => celoxisTask);
    };

    addInprocessProjectAndTaskId = async (celoxisTask) => {
        const { projectName, taskName } = celoxisTask;
        let task = await Task.findOne({
            where: {
                name: taskName
            },
            include: [
                {
                    model: Project,
                    where: {
                        name: projectName
                    },
                    attributes: [['id', 'projectId']]
                }
            ],
            attributes: [['id', 'taskId']]
        });
        task = JSON.parse(JSON.stringify(task));
        if (task) {
            celoxisTask = { ...celoxisTask, taskId: task.taskId, projectId: task.Project.projectId };

            const item = await Celoxis.create(celoxisTask);
            return JSON.parse(JSON.stringify(item));
        }
    };

    updateInprocessProjectById = async (celoxisProject, data) => {
        let project = await Project.findOne({
            where: {
                name: celoxisProject
            },
            attributes: ['id']
        });

        project = JSON.parse(JSON.stringify(project));
        if (project) {
            const item = await Project.update(data, { where: { id: project.id } });
            return JSON.parse(JSON.stringify(item));
        }
    };

    saveCeloxisRecordsInDB = async () => {
        const celoxisProjectResponse = await this.getAllProjectFromCeloxis();
        // const celoxisResponse = await this.getAllTasksFromCeloxis();
        // await Celoxis.destroy({ truncate: true });
        // return await this.formatCeloxisTasks(celoxisResponse);
        return celoxisProjectResponse;
    };

    findProject = async (data) => {
        const project = await Project.findOne({ where: data });
        return JSON.parse(JSON.stringify(project));
    };

    createProject = async (data) => {
        return await Project.create(data);
    };

    updateProject = async (data, where) => {
        console.log(data);
        return await Project.update(data, { where: where });
    };

    saveCelxiosDataProjects = async (project) => {
        const { name, celoxisId, clients, manager, Description, plannedEffort, state } = project;
        const inprocessProject = await this.findProject({ name });
        let Client, Manager;
        if (clients && clients.data) {
            Client = clients.data.name;
            delete project.clients;
        }
        if (manager && manager.data) {
            Manager = manager.data.name;
            delete project.manager;
        }
        if (inprocessProject) {
            const { id } = inprocessProject;
            let isDisable = 0;
            if (state !== "Activo") {
                isDisable = 1
            }
            await this.updateProject({ celoxisId, Manager, Client, Description, plannedEffort, isDisable: isDisable, type: " " }, { id });
            return inprocessProject;
        }
        project.Client = Client;
        project.Manager = Manager;
        project.type = "";
        delete project.state;
        return await this.createProject(project);
    };

    findUsers = async (data) => {
        const { email } = data;
        const user = await User.findOne({ where: { email } });
        return JSON.parse(JSON.stringify(user));
    };

    updateUser = async (data, where) => {
        return await User.update(data, { where: where });
    };

    createUsers = async (data) => {
        data.password = constant.USER.DEFAULT_PASSWORD;
        data.isEmailVerified = true;
        data.token = cryptoRandomString({ length: 20, type: 'url-safe' });
        return await User.create(data);
    };

    saveCelxiosDataUsers = async (data) => {
        const { name, email, celoxisId } = data
        const user = await this.findUsers({ name, email });
        if (user) {
            const { id } = user;
            await this.updateUser({ celoxisId }, { id });
            return user;
        }
        return await this.createUsers(data);
    };

    findTask = async (data) => {
        const task = await Task.findOne({ where: data });
        return JSON.parse(JSON.stringify(task));
    };

    createTask = async (data) => {
        return await Task.create(data);
    };

    updateTask = async (data, where) => {
        return await Task.update(data, { where: where });
    };

    saveCelxiosDataTasks = async (data) => {
        const { name, project, assignments, parent, celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN } = data;
        if (parent) {
            if (project && project.data && project.data.name) {
                const projectOld = await this.findProject({ name: project.data.name });
                const projectId = projectOld ? projectOld.id : 0;
                let ParentCelxiosId = 0
                let ParentTaskId = 0
                if (parent.data) {
                    const ParentProject = parent.data.project && parent.data.project.name ? parent.data.project : project;
                    const parentData = await this.saveCelxiosDataParentTask({ name: parent.data.name, project: ParentProject, assignments: parent.data.assignments && parent.data.assignments.data ? parent.data.assignments : {}, celoxisId: parent.data.id, plannedPercentComplete: parent.data.plannedPercentComplete, actualPercentComplete: parent.data.actualPercentComplete, plannedEffort: parent.data.plannedEffort, sN: parent.data.sN })
                    ParentCelxiosId = parent.data.id;
                    ParentTaskId = parentData.id;

                    let Task = await this.findTask({ name, celoxisId });
                    if (Task) {
                        const { id } = Task;
                        await this.updateTask({ ParentTaskId, ParentCelxiosId, celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN }, { id });
                    } else {
                        Task = await this.createTask({ name, projectId, celoxisId, ParentCelxiosId, ParentTaskId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN });
                    }
                    if (assignments.data) {
                        for (const assigment of assignments.data) {
                            const user = await this.getUserAssignmentDataFromCelxios(assigment.id);
                            const { name, email } = user;
                            const userData = await this.findUsers({ name, email });
                            const userId = userData.id;
                            const taskId = Task.id;
                            const taskType = "S";
                            await this.saveCelxiosDataUserTasks({ userId, projectId, taskId, taskType });
                        }
                    }
                }
            }
        } else {
            await this.saveCelxiosDataParentTask(data);
        }
    };

    findParentTask = async (data) => {
        const task = await ParentTasks.findOne({ where: data });
        return JSON.parse(JSON.stringify(task));
    };

    updateParentTask = async (data, where) => {
        const task = await ParentTasks.update(data, { where: where });
        return JSON.parse(JSON.stringify(task));
    };

    createParentTask = async (data) => {
        const task = await ParentTasks.create(data);
        return JSON.parse(JSON.stringify(task));
    };

    saveCelxiosDataParentTask = async (data) => {
        const { name, project, assignments, celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN } = data;
        if (project && project.data && project.data.name) {
            const projectOld = await this.findProject({ name: project.data.name });
            const projectId = projectOld ? projectOld.id : 0;
            let parentTask = await this.findParentTask({ name, celoxisId });
            if (parentTask) {
                const { id } = parentTask;
                await this.updateParentTask({ projectId, celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN }, { id });
            } else {
                parentTask = await this.createParentTask({ name, projectId, celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN });
            }
            if (assignments.data) {
                if (assignments.data) {
                    for (const assigment of assignments.data) {
                        const user = await this.getUserAssignmentDataFromCelxios(assigment.id);
                        const { name, email } = user;
                        const userData = await this.findUsers({ name, email });
                        const userId = userData.id;
                        const taskId = parentTask.id;
                        const taskType = "T";
                        await this.saveCelxiosDataUserTasks({ userId, projectId, taskId, taskType });
                    }
                }
            }
            return parentTask;
        }
        return 0;
    };

    findUserTask = async (data) => {
        const userTask = await UserTask.findOne({ where: data, attributes: ['id'] });
        return JSON.parse(JSON.stringify(userTask));
    };

    createUserTask = async (data) => {
        return await UserTask.create(data);
    };

    saveCelxiosDataUserTasks = async (data) => {
        const { userId, projectId, taskId, taskType } = data;
        const userTasksData = { userId, projectId, taskId, taskType, isAssigned: true };
        const userTask = await this.findUserTask(userTasksData);
        if (userTask) {
            return userTask;
        }
        return await this.createUserTask(userTasksData);
    };

    saveCeloxisRecordsInDBCron = async () => {
        const projects = await this.fetchDataFromCelxios(projectUrl);
        for (const project of projects) {
            const { name, id: celoxisId, clients, manager, description: Description, plannedEffort, state } = project;
            await this.saveCelxiosDataProjects({ name, celoxisId, clients, manager, Description, plannedEffort, state });
        }
        const users = await this.fetchDataFromCelxios(userUrl);
        for (const user of users) {
            const { name, email, id: celoxisId } = user;
            await this.saveCelxiosDataUsers({ name, email, celoxisId });
        }
        const tasks = await this.fetchDataFromCelxios(taskUrl);
        for (const task of tasks) {
            const { name, project, assignments, parent, id: celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN } = task;
            await this.saveCelxiosDataTasks({ name, project, assignments, parent, celoxisId, plannedPercentComplete, actualPercentComplete, plannedEffort, sN });
        }
        return true;
    };

    cleanDBRecordsCron = async () => {
        let tasks = await Task.findAll({
            where: {
                projectId: 115,
                celoxisId: {
                    [Op.lt]: 999999
                }
            }
        });
        let index = 0;
        for (let task of tasks) {
            const celxiosData = await this.getTaskDataFromCelxios(
                task.celoxisId
            );
            if (!celxiosData[0].id) {
                tasks[index].deleted = true;
                await task.destroy();
            } else {
                await task.update({ sN: celxiosData[0].sN });
            }
            index++;
        }
        tasks = tasks.filter(task => task.deleted === true);
        console.log('deleted tasks', tasks)

        let parenttasks = await ParentTasks.findAll({
            where: {
                projectId: 115,
                celoxisId: {
                    [Op.lt]: 999999
                }
            }
        });
        index = 0;
        for (let task of parenttasks) {
            const celxiosData = await this.getTaskDataFromCelxios(
                task.celoxisId
            );
            if (!celxiosData[0].id) {
                parenttasks[index].deleted = true;
                await task.destroy();
            } else {
                await task.update({ sN: celxiosData[0].sN });
                console.log('step', celxiosData[0].sN)
            }
            index++;
        }
        parenttasks = parenttasks.filter(task => task.deleted === true);
        console.log('deleted parenttasks', parenttasks)
    }

    getWorlLoadCelxios = async () => {
        const url = "timeEntries?";
        const worlLoad = await this.fetchDataFromCelxios(url);
        return worlLoad;
    }

    getProjectDataCelxios = async (id) => {
        const projectData = await this.fetchSingleDataFromCelxios(`projects/${id}?expand=manager,clients`)
        return projectData;
    }

    getCelxiosTask = async (data) => {
        const task = await this.fetchDataFromCelxios(`tasks?expand=assignments&`, data);
        return task;
    }

    getCelxiosTask2 = async (id) => {
        const task = await this.fetchDataFromCelxios(`tasks/${id}?expand=assignments&`);
        return task;
    }

    getMilestones = async (id) => {
        const axiosResponse = await axiosHelper.AxiosApiCall(`${constant.CELXIOS.API_BASE_URL}tasks`, JSON.stringify({ "filter": { "project.id": id, "plannedEffort": 0, "milestone": "Yes" } }));
        const { data } = axiosResponse.data;
        let task = data;
        task = task.filter((res) => res.name[0] === "M" && res.name[1] === "S");
        task = task.sort(this.GetSortOrder("name"));
        return task;
    }


    GetSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    getCelxiosActiveProject = async (id) => {
        const axiosResponse = await axiosHelper.AxiosApiCall(`${constant.CELXIOS.API_BASE_URL}projects`, JSON.stringify({ "filter": { "state": "Activo" } }));
        const { data } = axiosResponse.data;
        return data;
    }

};
