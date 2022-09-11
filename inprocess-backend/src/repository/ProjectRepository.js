'use strict';
const moment = require('moment');
const sequelize = require('sequelize');
const Project = require('../models').Project;
const Task = require('../models').Task;
const User = require('../models').User;
const Timesheet = require('../models').Timesheet;
const ParentTasks = require('../models').ParentTasks;
const Milestone = require('../models').Milestone;
const DB = require('../models');
const CeloxisService = require('../services/celoxisService');

const celoxisService = new CeloxisService();

const attributes = { exclude: ['isDisable', 'isDelete'] };
const { Op } = require('sequelize');
const { report } = require('../../app');

class ProjectRepository {
    async createProject(data) {
        return await Project.create(data, { attributes });
    }

    async findAllProjects() {
        const filter = {
            isDisable: false,
            isDelete: false
        };
        return await Project.findAll({ where: filter, attributes });
    }

    async findAllProjectsView() {
        const filter = {
            isDisable: false,
            isDelete: false,
        };
        const include = [
            {
                model: Milestone,
                attributes: ['id', 'name', 'progress', [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m-%d'), 'date']],
                where: {
                    progress: {
                        [Op.gte]: 0
                    }
                }
            }
        ];
        const attributes = ['id', 'name', 'risk_level'];
        const projects = await Project.findAll({
            include, where: filter, attributes
        });
        let viewData = [];
        let viewRow = {};
        let isFirstRow1, isFirstRow2;
        projects.forEach(project1 => {
            isFirstRow1 = true;
            projects.forEach(project2 => {
                isFirstRow2 = true;
                for(let i = 0; i < project1.Milestones.length || i < project2.Milestones.length; i++){
                    viewRow = {'projectName1':'','riskLevel1':'','milestoneName1':'','milestoneProgress1':'','milestoneDate1':'',
                    'projectName2':'','riskLevel2':'','milestoneName2':'','milestoneProgress2':'','milestoneDate2':''};
                    if(isFirstRow1){
                        viewRow['projectName1'] = project1.name;
                        viewRow['riskLevel1'] = project1.risk_level;
                        isFirstRow1 = false;
                    }
                    if(isFirstRow2){
                        viewRow['projectName2'] = project2.name;
                        viewRow['riskLevel2'] = project2.risk_level;
                        isFirstRow2 = false;
                    }
                    if(i < project1.Milestones.length ){
                        viewRow['milestoneName1'] = project1.Milestones[i].name;
                        viewRow['milestoneProgress1'] = project1.Milestones[i].progress + "%";
                        viewRow['milestoneDate1'] = project1.Milestones[i].date;
                    }
                    if(i < project2.Milestones.length ){
                        viewRow['milestoneName2'] = project2.Milestones[i].name;
                        viewRow['milestoneProgress2'] = project2.Milestones[i].progress + "%";
                        viewRow['milestoneDate2'] = project2.Milestones[i].date;
                    }
                    viewData.push(viewRow);
                }
            });
        });

        return viewData;
    }

    async findProjectByFilter(filter) {
        filter.isDisable = false;
        filter.isDelete = false;
        return await Project.findAll({ where: filter, attributes });
    }

    async updateProjectByFilter(data, filter) {
        filter.isDisable = false;
        filter.isDelete = false;
        await Milestone.destroy({ where: { projectId: filter.id } });
        console.log("data.milestones", data.milestones)
        await Milestone.bulkCreate(data.milestones);
        return await Project.update(data, { where: filter, attributes });
    }

    // async getProjectReportById(filter) {
    //     filter.isDisable = false;
    //     filter.isDelete = false;

    //     const projectTimeSheet = await DB.sequelize.query(
    //         `SELECT SUM(Timesheets.timespent) AS _total, YEAR(Timesheets.date) AS _year, MONTH(Timesheets.date) AS _month FROM Timesheets WHERE Timesheets.projectId = '${filter.id}' GROUP BY _year, _month ORDER BY _year, _month;`,
    //         {
    //             type: DB.Sequelize.QueryTypes.SELECT
    //         }
    //     );

    //     let project = await Project.findOne({
    //         where: filter
    //     });
    //     project = JSON.parse(JSON.stringify(project));

    //     const celxiosData = await celoxisService.getProjectDataCelxios(
    //         project.celoxisId
    //     );

    //     const estimated = [];
    //     const celoxis = [];
    //     const actual = [];

    //     let estimatedHour = 0;
    //     let celoxisHours = 0;
    //     let actualHour = 0;

    //     const total = project.hoursProposed;

    //     const projectStartDate = celxiosData.plannedStart;
    //     const projectEndDate = celxiosData.plannedFinish;

    //     const diff = await this.monthDiff(
    //         new Date(projectStartDate),
    //         new Date(projectEndDate)
    //     );

    //     const celxiosPlannedHour = celxiosData.plannedEffort;
    //     const perMonthCelxiosValue = (celxiosPlannedHour / diff).toFixed();
    //     const perMonthEstimateValue = (total / diff).toFixed();

    //     for (let i = 0; i < diff; i++) {
    //         celoxisHours += parseFloat(perMonthCelxiosValue);
    //         celoxis.push(celoxisHours);
    //     }

    //     for (let i = 0; i < diff; i++) {
    //         estimatedHour += parseFloat(perMonthEstimateValue);
    //         estimated.push(estimatedHour);
    //     }

    //     for (let i = 0; i < projectTimeSheet.length; i++) {
    //         const currentMonthData = projectTimeSheet[i];
    //         if (i !== 0) {
    //             const previousMonthData = projectTimeSheet[i - 1];
    //             const currentMonth = moment(
    //                 `${currentMonthData._year}-${currentMonthData._month}-01`,
    //                 'YYYY-MM-DD'
    //             );
    //             const previousMonth = moment(
    //                 `${previousMonthData._year}-${previousMonthData._month}-01`,
    //                 'YYYY-MM-DD'
    //             );
    //             const diff = moment(currentMonth).diff(
    //                 moment(previousMonth),
    //                 'months',
    //                 true
    //             );
    //             for (let i = 1; i < diff; i++) {
    //                 actual.push(actualHour);
    //             }
    //         }
    //         actualHour += parseFloat(currentMonthData._total);
    //         actual.push(actualHour);
    //     }

    //     let totalMonth = [];
    //     if (estimated.length >= actual.length) {
    //         totalMonth = await this.getTotalMonthGraph(estimated.length);
    //     } else if (celoxis.length >= actual.length) {
    //         totalMonth = await this.getTotalMonthGraph(celoxis.length);
    //     } else {
    //         totalMonth = await this.getTotalMonthGraph(actual.length);
    //     }

    //     project.projectTimeSheet = actualHour;

    //     const {
    //         data,
    //         numberOfEnfineers,
    //         currentNumberOfEngineers,
    //         delieveryDatePlanned,
    //         hoursProposed,
    //         celoxisHoursTotal,
    //         hoursUsed,
    //         pending,
    //         plannedBaseLine,
    //         real
    //     } = await this.getReportProject(project, celxiosData);
    //     return {
    //         celoxis,
    //         actual,
    //         estimated,
    //         totalMonth,
    //         data,
    //         numberOfEnfineers,
    //         currentNumberOfEngineers,
    //         delieveryDatePlanned,
    //         hoursProposed,
    //         celoxisHoursTotal,
    //         hoursUsed,
    //         pending,
    //         plannedBaseLine,
    //         real
    //     };
    // }

    async getProjectReportById(filter) {
        filter.isDisable = false;
        filter.isDelete = false;

        const projectTimeSheet = await DB.sequelize.query(
            `SELECT SUM(Timesheets.timespent) AS _total, YEAR(Timesheets.date) AS _year, MONTH(Timesheets.date) AS _month FROM Timesheets WHERE Timesheets.projectId = '${filter.id}' GROUP BY _year, _month ORDER BY _year, _month;`,
            {
                type: DB.Sequelize.QueryTypes.SELECT
            }
        );

        const realUser = await DB.sequelize.query(
            `SELECT count(distinct(Timesheets.userId)) AS _total FROM Timesheets WHERE Timesheets.projectId = ${filter.id};`,
            {
                type: DB.Sequelize.QueryTypes.SELECT
            }
        );

        let project = await Project.findOne({
            where: filter
        });

        // let project = await Project.findOne({
        //     include: [
        //         {
        //             model: ParentTasks,
        //             attributes: attributes,
        //             required: false,
        //             where: {
        //                 celoxisId: {
        //                     [Op.lt]: 999999
        //                 },
        //                 plannedEffort: {
        //                     [Op.eq]: 0
        //                 }
        //             }
        //         }
        //     ],
        //     attributes: attributes,
        //     where: filter
        // });
        project = JSON.parse(JSON.stringify(project));

        const celxiosData = await celoxisService.getProjectDataCelxios(
            project.celoxisId
        );

        // const tasks = await this.filterData(project.ParentTasks);

        const estimated = [];
        const celoxis = [];
        const actual = [];

        let estimatedHour = 0;
        let celoxisHours = 0;
        let actualHour = 0;

        const projectStartDate = celxiosData.plannedStart;
        const projectEndDate = celxiosData.plannedFinish;

        const diff = await this.monthDiff(
            new Date(projectStartDate),
            new Date(projectEndDate)
        );

        const celxiosPlannedHour = celxiosData.plannedEffort;
        const perMonthCelxiosValue = (celxiosPlannedHour / diff).toFixed();
        const baseLine = celxiosData.baselineEffort
            ? celxiosData.baselineEffort
            : celxiosData.baselineEffortVariance;
        const perMonthEstimateValue = (parseInt(baseLine) / diff).toFixed();

        for (let i = 0; i < diff; i++) {
            celoxisHours += parseFloat(perMonthCelxiosValue);
            celoxis.push(celoxisHours);
        }

        for (let i = 0; i < diff; i++) {
            estimatedHour += parseFloat(perMonthEstimateValue);
            estimated.push(estimatedHour);
        }

        for (let i = 0; i < projectTimeSheet.length; i++) {
            const currentMonthData = projectTimeSheet[i];
            if (i !== 0) {
                const previousMonthData = projectTimeSheet[i - 1];
                const currentMonth = moment(
                    `${currentMonthData._year}-${currentMonthData._month}-01`,
                    'YYYY-MM-DD'
                );
                const previousMonth = moment(
                    `${previousMonthData._year}-${previousMonthData._month}-01`,
                    'YYYY-MM-DD'
                );
                const diff = moment(currentMonth).diff(
                    moment(previousMonth),
                    'months',
                    true
                );
                for (let i = 1; i < diff; i++) {
                    actual.push(actualHour);
                }
            }
            actualHour += parseFloat(currentMonthData._total);
            actual.push(actualHour);
        }

        let totalMonth = [];
        if (estimated.length >= actual.length) {
            totalMonth = await this.getTotalMonthGraph(estimated.length);
        } else if (celoxis.length >= actual.length) {
            totalMonth = await this.getTotalMonthGraph(celoxis.length);
        } else {
            totalMonth = await this.getTotalMonthGraph(actual.length);
        }

        project.projectTimeSheet = actualHour;

        const newDat = await this.getReportProject(project, celxiosData);
        const realNoEng = realUser[0]._total;
        const real = (
            (parseInt(actualHour) * 100) /
            parseInt(celxiosData.plannedEffort)
        ).toFixed();

        const monthDiff = await this.monthDiff(
            new Date(),
            new Date(celxiosData.plannedFinish)
        );
        let number = (
            (parseInt(celxiosData.remainingEffort) * 100) /
            parseInt(celxiosData.plannedEffort)
        ).toFixed();
        if (monthDiff > 0) {
            number = number / monthDiff;
        }
        const partial = 9;
        let tasks = [];
        if (parseInt(project && project.celoxisId) > 0) {
            tasks = await this.getMilestones(project.celoxisId);
        }
        return {
            totalMonth,
            actual,
            estimated,
            celoxis,
            celxiosData,
            project,
            newDat,
            // tasks,
            tasks,
            realNoEng,
            real,
            number,
            partial,
            baseLine

            // data,
            // numberOfEnfineers,
            // currentNumberOfEngineers,
            // delieveryDatePlanned,
            // hoursProposed,
            // celoxisHoursTotal,
            // hoursUsed,
            // pending,
            // plannedBaseLine,
            // real,
        };
    }

    async getProjectReport(request) {
        const filter = {
            isDisable: false,
            isDelete: false
        };

        const field = [
            { label: 'Project Id', key: 'id' },
            { label: 'Project Name', key: 'name' },
            { label: 'Start Date', key: 'startDate' },
            { label: 'End Date', key: 'endDate' },
            { label: 'Total Periods', key: 'totalPeriods' },
            { label: 'Total Hourds', key: 'hoursProposed' }
        ];

        const project = await DB.sequelize.query(
            `SELECT Projects.*, SUM(Timesheets.timespent) AS _total FROM Projects left join Timesheets ON Timesheets.projectId = Projects.id GROUP BY Projects.id order by Projects.id;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        const projectTimeSheet = await DB.sequelize.query(
            `SELECT projectId, SUM(timespent) AS _total, YEAR(Timesheets.date) AS _year, MONTH(Timesheets.date) AS _month FROM Timesheets WHERE Timesheets.date BETWEEN '${request.startDate}' AND '${request.endDate}' GROUP BY projectId, _year, _month ORDER BY projectId, _year, _month;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        const endDate = moment(request.endDate);
        const startDate = moment(request.startDate);
        const data = project.map((el, index) => {
            const dataObj = {};
            dataObj.id = el.id;
            dataObj.name = el.name;
            dataObj.startDate = moment(el.startDate).format('YYYY-MM-DD');
            dataObj.endDate =  moment(el.celoxisEndDate).format('YYYY-MM-DD');
            const ar = [];
            const startDate = moment(request.startDate);
            let total = 0;

            while (
                endDate > startDate ||
                startDate.format('M') === endDate.format('M')
            ) {
                const filterData = projectTimeSheet.filter(
                    (res) =>
                        res.projectId === el.id &&
                        res._year === startDate.year() &&
                        res._month === startDate.month() + 1
                );
                if (filterData.length >= 1) {
                    total += parseFloat(filterData[0]._total);
                    dataObj[startDate.format('MMMM')] = parseFloat(
                        filterData[0]._total
                    );
                } else {
                    dataObj[startDate.format('MMMM')] = 0;
                }
                startDate.add(1, 'month');
            }
            dataObj.totalPeriods = total;
            dataObj.hoursProposed = el._total ? el._total : 0;
            return dataObj;
        });

        while (
            endDate > startDate ||
            startDate.format('M') === endDate.format('M')
        ) {
            field.splice(field.length - 2, 0, {
                label: startDate.format('MMMM'),
                key: startDate.format('MMMM')
            });
            startDate.add(1, 'month');
        }
        return { data, field };
    }

    async getYearlyProjectReport(year) {
        const field = [
            { label: 'Project Id', key: 'id' },
            { label: 'Project Name', key: 'name' }
        ];

        const RequestStartDate = `${year}-01-01T13:05:24+00:00`;
        const RequestEndDate = `${year}-12-01T13:05:24+00:00`;

        const project = await DB.sequelize.query(
            `SELECT Projects.*, SUM(Timesheets.timespent) AS _total FROM Projects left join Timesheets ON Timesheets.projectId = Projects.id WHERE Projects.celoxisId > 0 GROUP BY Projects.id order by Projects.celoxisId;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        const projectTimeSheet = await DB.sequelize.query(
            `SELECT projectId, SUM(timespent) AS _total, YEAR(Timesheets.date) AS _year, MONTH(Timesheets.date) AS _month FROM Timesheets WHERE Timesheets.date BETWEEN '${RequestStartDate}' AND '${RequestEndDate}' GROUP BY projectId, _year, _month ORDER BY projectId, _year, _month;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        const endDate = moment(RequestEndDate);
        const startDate = moment(RequestStartDate);
        const data = project.map((el, index) => {
            const dataObj = {};
            dataObj.id = el.celoxisId;
            dataObj.name = el.name;
            const startDate = moment(RequestStartDate);
            let total = 0;
            while (
                endDate > startDate ||
                startDate.format('M') === endDate.format('M')
            ) {
                const filterData = projectTimeSheet.filter(
                    (res) =>
                        res.projectId === el.id &&
                        res._year === startDate.year() &&
                        res._month === startDate.month() + 1
                );
                if (filterData.length >= 1) {
                    dataObj[startDate.format('MMMM')] = parseFloat(
                        filterData[0]._total
                    );
                    total += parseFloat(filterData[0]._total);
                } else {
                    dataObj[startDate.format('MMMM')] = 0;
                }
                startDate.add(1, 'month');
            }
            dataObj['total'] = total;
            return dataObj;
        });

        while (
            endDate > startDate ||
            startDate.format('M') === endDate.format('M')
        ) {
            field.splice(field.length, 0, {
                label: startDate.format('MMMM YYYY'),
                key: startDate.format('MMMM')
            });
            startDate.add(1, 'month');
        }
        field.push({
            label: 'Total',
            key: 'total'
        });
        return { data, field };
    }

    // async getProjectReportByUser(request) {
    //     const filter = {
    //         isDisable: false,
    //         isDelete: false
    //     };
    //     const field = [{ label: '', key: 'name' }];

    //     let project = await Project.findAll({ where: filter, attributes });
    //     project = JSON.parse(JSON.stringify(project));
    //     let user = await User.findAll({ where: filter, attributes });
    //     user = JSON.parse(JSON.stringify(user));
    //     const data = [];
    //     const FinalObj = {};
    //     const timesheet = await DB.sequelize.query(
    //         `SELECT SUM(timespent) as timespent, userId, projectId FROM Timesheets WHERE Timesheets.date BETWEEN '${request.startDate}' AND '${request.endDate}' GROUP BY userId, projectId ORDER BY userId, projectId`,
    //         { type: DB.Sequelize.QueryTypes.SELECT }
    //     );
    //     user.map((res, index) => {
    //         const obj = {};
    //         project.map((el) => {
    //             const filterData = timesheet.filter(
    //                 (fil) => fil.userId === res.id && fil.projectId === el.id
    //             );
    //             if (filterData.length >= 1) {
    //                 obj[el.id] = parseFloat(filterData[0].timespent);
    //             } else {
    //                 obj[el.id] = 0;
    //             }
    //             if (index === 0) {
    //                 FinalObj[el.id] = parseFloat(obj[el.id]);
    //                 field.splice(1, 0, {
    //                     label: el.name,
    //                     key: el.id.toString()
    //                 });
    //             } else {
    //                 FinalObj[el.id] += obj[el.id];
    //             }
    //         });
    //         obj.name = res.name;
    //         data.push(obj);
    //         if (index === user.length - 1) {
    //             FinalObj.name = 'Total';
    //             data.push(FinalObj);
    //         }
    //     });

    //     return { data, field };
    // }

    async getProjectReportByUser(request) {
        let user = await User.findOne({
            where: {
                id: request.id
            },
            attributes: ['name']
        });
        user = JSON.parse(JSON.stringify(user));

        const field = [
            { key: 'Project', label: '' },
            { key: 'total', label: user.name }
        ];

        let data = await Timesheet.findAll({
            include: [
                {
                    model: Project,
                    attributes: ['name']
                }
            ],
            where: {
                userId: request.id,
                date: {
                    [Op.between]: [
                        moment(request.startDate).format('YYYY-MM-DD'),
                        moment(request.endDate).format('YYYY-MM-DD')
                    ]
                }
            },
            attributes: [
                [DB.sequelize.fn('sum', DB.sequelize.col('timespent')), 'total']
            ],
            group: ['projectId']
        });
        data = JSON.parse(JSON.stringify(data));
        data = data.map((res) => {
            res.Project = res.Project.name;
            return res;
        });
        return { data, field };
    }

    async getProjectReportByManager(request) {
        const filter = {
            isDisable: false,
            isDelete: false
        };
        const field = [{ label: '', key: 'name' }];
        let project = await Project.findAll({ where: filter, attributes });
        project = JSON.parse(JSON.stringify(project));
        const Manager = await DB.sequelize.query(
            `SELECT Manager, id FROM Projects WHERE Manager != '' GROUP BY Manager, id ORDER BY Manager, id`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        const finalAr = [];
        let obj = [];
        Manager.map((res, index) => {
            if (
                index + 1 < Manager.length &&
                Manager[index + 1].Manager === res.Manager
            ) {
                obj.push(res.id);
            } else {
                obj.push(res.id);
                finalAr.push({ Manager: res.Manager, ids: obj });
                obj = [];
            }
        });
        const data = [];
        const FinalObj = {};
        const timesheet = await DB.sequelize.query(
            `SELECT SUM(timespent) as timespent, projectId FROM Timesheets WHERE Timesheets.date BETWEEN '${request.startDate}' AND '${request.endDate}' GROUP BY projectId ORDER BY projectId`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        finalAr.map((res, index) => {
            const obj = {};
            project.map((el) => {
                const pIndex = res.ids ? res.ids.indexOf(el.id) : -1;
                const filterData = timesheet.filter(
                    (fil) => fil.projectId === el.id && pIndex > -1
                );
                if (filterData.length >= 1) {
                    obj[el.id] = parseFloat(filterData[0].timespent);
                } else {
                    obj[el.id] = 0;
                }

                if (index === 0) {
                    field.splice(1, 0, {
                        label: el.name,
                        key: el.id.toString()
                    });
                    FinalObj[el.id] = parseFloat(obj[el.id]);
                } else {
                    FinalObj[el.id] += obj[el.id];
                }
            });
            obj.name = res.Manager;
            data.push(obj);
            if (index === project.length - 1) {
                FinalObj.name = 'Total';
                data.push(FinalObj);
            }
        });
        return { data, field };
    }

    async getProjectReportByManagerReport2(request) {
        const filter = {
            isDisable: false,
            isDelete: false,
            id: request.id
        };

        let project = await Project.findAll({ where: filter, attributes });
        project = JSON.parse(JSON.stringify(project));
        const field = [{ label: project[0].name, key: 'name' }];
        const Manager = await DB.sequelize.query(
            `SELECT Manager, id FROM Projects WHERE Manager != '' GROUP BY Manager, id ORDER BY Manager, id`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        const finalAr = [];
        let obj = [];
        let total = 0;
        // const data = [];

        const endDate = moment(request.endDate);
        const startDate = moment(request.startDate);

        while (
            endDate > startDate ||
            startDate.format('M') === endDate.format('M')
        ) {
            field.splice(field.length, 0, {
                label: startDate.format('MMMM YYYY'),
                key: startDate.format('MMMM')
            });
            startDate.add(1, 'month');
        }

        field.push({ label: 'Total', key: 'total' });

        if (field.length < 5) {
            for (let i = field.length; i < 5; i++) {
                field.push({ label: '', key: `field${i}` });
            }
        }

        Manager.map((res, index) => {
            if (
                index + 1 < Manager.length &&
                Manager[index + 1].Manager === res.Manager
            ) {
                obj.push(res.id);
            } else {
                obj.push(res.id);
                finalAr.push({ Manager: res.Manager, ids: obj });
                obj = [];
            }
        });

        const FinalObj = {};

        const timesheet = await DB.sequelize.query(
            `SELECT userId, SUM(timespent) AS _total FROM Timesheets WHERE projectId=${request.id} GROUP BY userId ORDER BY userId;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        const userTimeSheet = await DB.sequelize.query(
            `SELECT userId, SUM(timespent) AS _total, YEAR(Timesheets.date) AS _year, MONTH(Timesheets.date) AS _month FROM Timesheets WHERE Timesheets.date BETWEEN '${request.startDate}' AND '${request.endDate}' AND projectId=${request.id} GROUP BY userId, _year, _month ORDER BY userId, _year, _month;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        const users = await DB.sequelize.query(
            `SELECT Users.*, SUM(Timesheets.timespent) AS _total FROM Users left join Timesheets ON Timesheets.userId = Users.id WHERE Timesheets.projectId = ${request.id} GROUP BY Users.id order by Users.id;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        const data = users.map((resp) => {
            const obj = {};
            let t = 0;
            project.map((el) => {
                const startDate = moment(request.startDate);
                const dataObj = {};
                while (
                    endDate > startDate ||
                    startDate.format('M') === endDate.format('M')
                ) {
                    const filterData = userTimeSheet.filter(
                        (res) =>
                            res.userId === resp.id &&
                            res._year === startDate.year() &&
                            res._month === startDate.month() + 1
                    );
                    if (filterData.length >= 1) {
                        const val = parseFloat(filterData[0]._total);
                        obj[startDate.format('MMMM')] = val;
                        t += val;
                        total += val;
                    } else {
                        obj[startDate.format('MMMM')] = 0;
                    }
                    startDate.add(1, 'month');
                }
            });
            obj.total = t;
            obj.name = resp.name;
            return obj;
        });

        data.push({ name: 'Total', total: total });
        data.push({ name: '' });

        const weekName = { name: '' };
        const weekDate = { name: '' };
        const weekTotal = { name: 'Total' };

        const dateArray = [];
        const sDate = moment(new Date());
        for (let i = 1; i < 5; i++) {
            const week = moment(sDate.format()).format('DD/MM');
            const obj = { sDate: sDate.format() };
            sDate.subtract(6, 'd');
            obj.eDate = sDate.format();
            sDate.subtract(1, 'd');
            dateArray.splice(0, 0, obj);
            weekName[field[i].key] = `W${i}`;
            weekTotal[field[i].key] = 0;
            weekDate[field[5 - i].key] = `${moment(sDate.format()).format(
                'DD/MM'
            )}-${week}`;
        }
        data.push(weekName);
        data.push(weekDate);
        for (const res of users) {
            const obj = {
                name: res.name
            };
            let i = 1;
            for (const key of dateArray) {
                const timesheet = await DB.sequelize.query(
                    `SELECT SUM(timespent) AS total FROM Timesheets WHERE Timesheets.date BETWEEN '${key.eDate}' AND '${key.sDate}' AND projectId=${request.id} AND userId = ${res.id}`,
                    { type: DB.Sequelize.QueryTypes.SELECT }
                );
                obj[field[i].key] = timesheet[0].total ? timesheet[0].total : 0;
                weekTotal[field[i].key] += parseInt(obj[field[i].key]);
                i++;
            }

            data.push(obj);
        }
        data.push(weekTotal);

        data.push({ name: '' });
        users.map((res, index) => {
            const obj = {};
            project.map((el) => {
                if (index === 0) {
                    const newAr = {};
                    newAr.name = '';
                    newAr[field[1].key] = el.name;
                    data.push(newAr);
                }
                const filterData = timesheet.filter(
                    (fil) => fil.userId === res.id
                );
                if (filterData.length >= 1) {
                    obj[field[1].key] = parseFloat(filterData[0]._total);
                } else {
                    obj[field[1].key] = 0;
                }

                if (index === 0) {
                    FinalObj[field[1].key] = parseFloat(obj[el.id]);
                } else {
                    FinalObj[field[1].key] += obj[el.id];
                }
            });
            obj.name = res.name;
            data.push(obj);
            if (index === users.length - 1) {
                FinalObj.name = 'Total';
                FinalObj[field[1].key] = total;
                data.push(FinalObj);
            }
        });
        return { data: data, field };
    }

    async getYearlyUserReport(year) {
        const field = [
            { label: 'Celxios Id', key: 'id' },
            { label: 'Name', key: 'name' }
        ];

        const RequestStartDate = `${year}-01-01T13:05:24+00:00`;
        const RequestEndDate = `${year}-12-01T13:05:24+00:00`;

        const users = await DB.sequelize.query(
            `SELECT Users.*, SUM(Timesheets.timespent) AS _total FROM Users left join Timesheets ON Timesheets.userId = Users.id GROUP BY Users.id order by Users.id;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        const userTimeSheet = await DB.sequelize.query(
            `SELECT userId, SUM(timespent) AS _total, YEAR(Timesheets.date) AS _year, MONTH(Timesheets.date) AS _month FROM Timesheets WHERE Timesheets.date BETWEEN '${RequestStartDate}' AND '${RequestEndDate}' GROUP BY userId, _year, _month ORDER BY userId, _year, _month;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        const endDate = moment(RequestEndDate);
        const startDate = moment(RequestStartDate);
        const data = users.map((el, index) => {
            const dataObj = {};
            dataObj.id = el.id;
            dataObj.name = el.name;
            const startDate = moment(RequestStartDate);

            while (
                endDate > startDate ||
                startDate.format('M') === endDate.format('M')
            ) {
                const filterData = userTimeSheet.filter(
                    (res) =>
                        res.userId === el.id &&
                        res._year === startDate.year() &&
                        res._month === startDate.month() + 1
                );
                if (filterData.length >= 1) {
                    dataObj[startDate.format('MMMM')] = parseFloat(
                        filterData[0]._total
                    );
                } else {
                    dataObj[startDate.format('MMMM')] = 0;
                }
                startDate.add(1, 'month');
            }
            return dataObj;
        });

        while (
            endDate > startDate ||
            startDate.format('M') === endDate.format('M')
        ) {
            field.splice(field.length, 0, {
                label: startDate.format('MMMM YYYY'),
                key: startDate.format('MMMM')
            });
            startDate.add(1, 'month');
        }
        return { data, field };
    }

    async getProjectReportByProjectId(filter) {
        const { id, type } = filter;
        let project = await Project.findOne({
            include: [
                {
                    model: ParentTasks,
                    attributes: attributes,
                    required: false,
                    include: [
                        {
                            model: Task,
                            attributes: attributes,
                            required: false,
                            where: {
                                celoxisId: {
                                    [Op.lt]: 999999
                                }
                            },
                        }
                    ],
                    where: {
                        celoxisId: {
                            [Op.lt]: 999999
                        }
                    },
                },
                Milestone
            ],
            attributes: attributes,
            where: { id },
            order: [[ParentTasks, 'sN', 'asc'], [ParentTasks, Task, 'sN', 'asc'], [Milestone, 'id', 'asc']],
        });

        let total = 0;
        let planned = 0;
        let actial = 0;
        let taskCount = 0;
        project = JSON.parse(JSON.stringify(project));

        const result = await DB.sequelize.query(
            `SELECT SUM(CASE WHEN ISNULL(t2.id) THEN t1.plannedEffort ELSE t2.plannedEffort END) as totalEffort FROM Projects AS t3 LEFT JOIN ParentTasks AS t1 ON t1.projectId = t3.id LEFT JOIN Tasks AS t2 ON t2.ParentTaskId = t1.id WHERE t3.id = ${id};`,
            {
                type: DB.Sequelize.QueryTypes.SELECT
            }
        );
        const totalEffort = parseInt(result[0].totalEffort);
        let tasks = [];
        if (project.ParentTasks) {
            for(let res of project.ParentTasks)  {
                if (res.Tasks.length > 0 && type === 1) {
                    res.Tasks.map((item) => {
                        if (item.plannedEffort === 0) {
                            tasks.push(item);
                        }
                        const weight = (
                            (item.plannedEffort / totalEffort) *
                            100
                        ).toFixed(2);
                        item.weight = weight;
                        total += parseFloat(weight);
                        planned += parseFloat(item.plannedPercentComplete);
                        actial += parseFloat(item.actualPercentComplete);
                        item.clientActual = item.actualPercentComplete;
                        taskCount++;
                    });
                } else {
                    const weight = (
                        (res.plannedEffort / totalEffort) *
                        100
                    ).toFixed(2);
                    res.weight = weight;
                    total += parseFloat(weight);
                    planned += parseFloat(res.plannedPercentComplete);
                    actial += parseFloat(res.actualPercentComplete);
                    res.clientActual = res.actualPercentComplete;
                    taskCount++;
                    // if (res.plannedEffort === 0) {
                    //     tasks.push(res);
                    // }
                    res.Tasks.map((item) => {
                        if (item.plannedEffort === 0) {
                            tasks.push(item);
                        }
                    });
                    res.Tasks = [];
                }
            };
        }
       tasks = await this.filterData(tasks);
       
       project.totalweight = total.toFixed(0);
       project.planned = (planned / taskCount).toFixed(0);
       project.actual = (actial / taskCount).toFixed(0);
       project.actualClient = (actial / taskCount).toFixed(0);
       project.tasks = tasks;
        return project;
    }

    async filterData(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            const celxiosData = await celoxisService.getTaskDataFromCelxios(
                tasks[i].celoxisId
            );
            if (celxiosData[0].id) {
                tasks[i].plannedFinish = moment(
                    celxiosData[0].plannedFinish
                ).format('DD MMM');
                tasks[i].actualFinish = moment(celxiosData[0].actualFinish).format(
                    'DD MMM'
                );
                tasks[i].valuePer = celxiosData[0].actualPercentComplete;
                tasks[i]['celx'] = celxiosData;
            }
        }
        return tasks;
    }

    async getReportProject(project, data) {
        const {
            noOfAcutal,
            declaredProduction,
            effortBudgetFromProppsal,
            celoxisId,
            name,
            hoursProposed,
            realBasedLine,
            risk,
            comment,
            projectTimeSheet
        } = project;

        // let project = await Project.findOne({
        //     attributes: attributes,
        //     where: { id: projectId }
        // });
        // project = JSON.parse(JSON.stringify(project));

        const numberOfEnfineers =
            data.plannedEffort > projectTimeSheet
                ? ((data.plannedEffort - projectTimeSheet) / 8).toFixed()
                : 0;
        const currentNumberOfEngineers = noOfAcutal;
        const delieveryDatePlanned = data.plannedFinish;
        const celoxisHoursTotal = data.plannedEffort;
        const hoursUsed = projectTimeSheet;
        const pending =
            data.plannedEffort > projectTimeSheet
                ? data.plannedEffort - projectTimeSheet
                : 0;
        const real = realBasedLine;
        const plannedBaseLine = project.plannedBasedLine;

        return {
            numberOfEnfineers,
            currentNumberOfEngineers,
            delieveryDatePlanned,
            celoxisHoursTotal,
            hoursUsed,
            pending,
            plannedBaseLine,
            real,
            hoursProposed
        };
    }

    async getProjectResourcesHours() {
        const field = [
            { label: 'Id', key: 'id' },
            { label: 'Employee', key: 'username' },
            { label: 'Work Load', key: 'workload' },
            { label: 'Finish Date', key: 'finishDate' }
        ];
        const usersData = [];
        const userIds = [];
        const data = [];
        const project = await DB.sequelize.query(
            `SELECT Projects.id, Projects.plannedEffort,Projects.celoxisId,Projects.name,  SUM(Timesheets.timespent) AS _total FROM Projects left join Timesheets ON Timesheets.projectId = Projects.id WHERE Projects.isDisable = 0 and Projects.isDelete = 0 and Projects.celoxisId != 0 GROUP BY Projects.id;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );

        for (const res of project) {
            const remainingEffort = res.plannedEffort - res._total;
            if (remainingEffort > 0) {
                const effortPerMonth = remainingEffort / 4;
                const users = await DB.sequelize.query(
                    `SELECT distinct(Users.name), Users.id FROM Users LEFT JOIN Timesheets ON Timesheets.userId = Users.id WHERE Timesheets.projectId = ${res.id};`,
                    { type: DB.Sequelize.QueryTypes.SELECT }
                );
                if (users.length > 0) {
                    const workload = (effortPerMonth / users.length).toFixed(0);
                    for (const resp of users) {
                        const index = usersData.findIndex(
                            (res) => res.username === resp.name
                        );
                        if (index > -1) {
                            usersData[index].workload += parseInt(workload);
                        } else {
                            userIds.push(resp.id);
                            usersData.push({
                                id: '',
                                username: resp.name,
                                workload: parseInt(workload)
                                // finishDate: moment(date).format('YYYY-MM-DD')
                            });
                        }
                    }
                }
            }
        }

        let i = 1;
        
        for (const resp of usersData) {
            const date = await this.getEndDate(
                Math.ceil(resp.workload / 8),
                new Date()
            );
            resp.finishDate = moment(date).format('YYYY-MM-DD');
            resp.id = i;
            i++;
        }
        let freeUser = await User.findAll({
            where: {
                id: { [Op.notIn]: userIds }
            }
        });
        freeUser = JSON.parse(JSON.stringify(freeUser));
        freeUser.map((res) => {
            usersData.push({
                id: i,
                username: res.name,
                workload: 0,
                finishDate: '-'
            });
            i++;
        });
        
        usersData.sort((a, b) => {
            if (a.username < b.username)
              return -1;
            if (a.username > b.username)
              return 1;
            return 0;
          });
        usersData.map((item, index) => {
            item.id = index + 1;
        });

        return { field, data: usersData };
    }

    async getProjectTaskReport(data) {
        const monthDiff = await this.monthDiff(
            new Date(data.startDate),
            new Date(data.endDate)
        );
        let tasks = [];
        const finalAr = [];
        const field = [{ label: 'Name', key: 'name' }];
        let project = await Project.findOne({
            include: [
                {
                    model: ParentTasks,
                    attributes: ['name', 'id', 'celoxisId']
                },
                {
                    model: Task,
                    attributes: ['name', 'id', 'celoxisId']
                }
            ],
            where: {
                id: data.id
            },
            attributes: ['name', 'id']
        });
        project = JSON.parse(JSON.stringify(project));
        finalAr.push({
            name: `PROJECT NAME: ${project.name}`
        });
        finalAr.push({});
        let startDate = new Date(data.startDate);

        const ParentTasksIds = project.ParentTasks.map((res) => {
            return res.celoxisId;
        });

        const TasksIds = project.Tasks.map((res) => {
            return res.celoxisId;
        });
        let ids = ParentTasksIds.concat(TasksIds);
        ids = [...new Set(ids)];
        const celxiosIds = ids.reduce((result, value, index, array) => {
            if (index % 10 === 0) result.push(array.slice(index, index + 10));
            return result;
        }, []);

        // celxiosIds.map(res => {
        // })
        let celxiosData = [];
        for (const iterator of celxiosIds) {
            const response = await celoxisService.getCelxiosTask2(
                iterator.toString()
            );
            celxiosData = celxiosData.concat(response);
        }
        for (let index = 0; index <= monthDiff; index++) {
            let endDate;
            if (index !== 0) {
                startDate = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    1
                );
            }

            if (index === monthDiff) {
                endDate = new Date(data.endDate);
            } else {
                endDate = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth() + 1,
                    0
                );
            }

            field.push({
                label: moment(startDate).format('MMMM'),
                key: `month${index}`
            });
            const dates = {
                startDate,
                endDate
            };
            tasks = await this.getReport(
                project.ParentTasks,
                1,
                data.id,
                dates,
                tasks,
                celxiosData
            );
            tasks = await this.getReport(
                project.Tasks,
                2,
                data.id,
                dates,
                tasks,
                celxiosData
            );
            startDate.setMonth(startDate.getMonth() + 1);
        }

        // tasks.map((res) => {
        for (const res of tasks) {
            const taskAr = { name: res.task };
            finalAr.push(taskAr);
            const celxiosTask = celxiosData.find(
                (item) => parseInt(item.id) === res.celoxisId
            );
            const users = [];
            for (const iterator of celxiosTask.assignments.data) {
                const response =
                    await celoxisService.fetchSingleDataFromCelxios(
                        `taskAssignments/${iterator.id}/resource`
                    );
                response.plannedEffort = iterator.plannedEffort;
                users.push(response);
            }
            for (const item of res.user) {
                const userData = users.find(
                    (usr) => parseInt(usr.id) === item.celoxisId
                );
                startDate = new Date(data.startDate);
                const CelxiosAr = { name: item.name };
                const ar = { name: '' };
                for (let index = 0; index <= monthDiff; index++) {
                    let endDate;
                    if (index !== 0) {
                        startDate = new Date(
                            startDate.getFullYear(),
                            startDate.getMonth(),
                            1
                        );
                    }

                    if (index === monthDiff) {
                        endDate = new Date(data.endDate);
                    } else {
                        endDate = new Date(
                            startDate.getFullYear(),
                            startDate.getMonth() + 1,
                            0
                        );
                    }
                    if (userData) {
                        CelxiosAr[`month${index}`] =
                            await this.getEffortCalculation(
                                userData.plannedEffort,
                                celxiosTask.plannedStart,
                                celxiosTask.plannedFinish,
                                startDate,
                                endDate
                            );
                    } else {
                        CelxiosAr[`month${index}`] = 0;
                    }

                    const ind = item.timesheet.findIndex(
                        (resp) => resp.month === startDate.getMonth() + 1
                    );
                    if (ind > -1) {
                        ar[`month${index}`] = item.timesheet[ind].total;
                        // CelxiosAr[`month${index}`] = 50;
                    } else {
                        // CelxiosAr[`month${index}`] = 0;
                        ar[`month${index}`] = 0;
                    }
                    startDate.setMonth(startDate.getMonth() + 1);
                }
                finalAr.push(CelxiosAr);
                finalAr.push(ar);
            }
            finalAr.push({});
        }

        return { field, data: finalAr };
    }

    async getReport(data, type, projectId, dates, tasks, celxiosData) {
        const groupBy = ['userId'];
        if (type === 1) {
            groupBy.push('parentTaskId');
        } else {
            groupBy.push('taskId');
        }
        const taskAr = tasks;
        for (const res of data) {
            const where = {
                projectId: projectId,
                date: {
                    [Op.between]: [
                        moment(dates.startDate).format('YYYY-MM-DD'),
                        moment(dates.endDate).format('YYYY-MM-DD')
                    ]
                }
            };
            if (type === 1) {
                where.parentTaskId = res.id;
            } else {
                where.taskId = res.id;
            }
            let timesheet = await Timesheet.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['name', 'celoxisId']
                    }
                ],
                where: where,
                attributes: [
                    [
                        DB.sequelize.fn('sum', DB.sequelize.col('timespent')),
                        'total'
                    ]
                ],
                group: groupBy
            });
            timesheet = JSON.parse(JSON.stringify(timesheet));

            timesheet.task = res.name;
            if (timesheet.length > 0) {
                timesheet.map((item) => {
                    const index = taskAr.findIndex(
                        (it) => it.task === res.name && it.taskId === res.id
                    );
                    if (index > -1) {
                        const ind = taskAr[index].user.findIndex(
                            (itm) => itm.name === item.User.name
                        );
                        if (ind > -1) {
                            taskAr[index].user[ind].timesheet.push({
                                total: item.total,
                                month: dates.startDate.getMonth() + 1
                            });
                        } else {
                            taskAr[index].user.push({
                                name: item.User.name,
                                celoxisId: item.User.celoxisId,
                                timesheet: [
                                    {
                                        total: item.total,
                                        month: dates.startDate.getMonth() + 1
                                    }
                                ]
                            });
                        }
                    } else {
                        taskAr.push({
                            task: res.name,
                            taskId: res.id,
                            celoxisId: res.celoxisId,
                            user: [
                                {
                                    name: item.User.name,
                                    celoxisId: item.User.celoxisId,
                                    timesheet: [
                                        {
                                            total: item.total,
                                            month:
                                                dates.startDate.getMonth() + 1
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                });
            }
        }
        return taskAr;
    }

    async getTotalMonthGraph(count) {
        const monthArray = [];
        for (let i = 0; i < count; i++) {
            monthArray.push(`${i + 1} Month`);
        }
        return monthArray;
    }

    async monthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    async daysDiff(d1, d2) {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const diffTime = date2.getTime() - date1.getTime();
        return diffTime / (1000 * 60 * 60 * 24);
    }

    async getEndDate(noOfDaysToAdd, date) {
        const startDate = new Date(date);
        let endDate = '';
        let count = 0;
        while (count < noOfDaysToAdd) {
            endDate = new Date(startDate.setDate(startDate.getDate() + 1));
            if (endDate.getDay() != 0 && endDate.getDay() != 6) {
                // Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
                count++;
            }
        }
        return endDate;
    }

    async getBusinessDateCount(dDate1, dDate2) {
        // input given as Date objects
        let iWeeks = 0;
        let iDateDiff = 0;
        let iAdjust = 0;
        if (dDate2 < dDate1) return -1; // error code if dates transposed
        let iWeekday1 = dDate1.getDay(); // day of week
        let iWeekday2 = dDate2.getDay();
        iWeekday1 = iWeekday1 === 0 ? 7 : iWeekday1; // change Sunday from 0 to 7
        iWeekday2 = iWeekday2 === 0 ? 7 : iWeekday2;
        if (iWeekday1 > 5 && iWeekday2 > 5) iAdjust = 1; // adjustment if both days on weekend
        iWeekday1 = iWeekday1 > 5 ? 5 : iWeekday1; // only count weekdays
        iWeekday2 = iWeekday2 > 5 ? 5 : iWeekday2;

        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000);

        if (iWeekday1 < iWeekday2) {
            // Equal to makes it reduce 5 days
            iDateDiff = iWeeks * 5 + (iWeekday2 - iWeekday1);
        } else {
            iDateDiff = (iWeeks + 1) * 5 - (iWeekday1 - iWeekday2);
        }

        iDateDiff -= iAdjust; // take into account both days on weekend

        return iDateDiff + 1; // add 1 because dates are inclusive
    }

    async getDaysArray(start, end) {
        const ar = [];
        start.setHours(0, 0, 0, 0);
        // end.setHours(0, 0, 0, 0);
        const startDate = moment(start);
        const endDate = moment(end);

        while (endDate >= startDate) {
            if (
                startDate.format('dddd') !== 'Saturday' &&
                startDate.format('dddd') !== 'Sunday'
            ) {
                ar.push(startDate.format('YYYY-MM-DD'));
            }
            startDate.add(1, 'day');
        }
        return ar;
    }

    async getEffortCalculation(
        plannedEffort,
        plannedStart,
        plannedFinish,
        startDate,
        endDate
    ) {
        const pStart = new Date(plannedStart);
        const NewStart = new Date(plannedStart);
        const pFinish = new Date(plannedFinish);
        const cStart = new Date(startDate);
        const cEnd = new Date(endDate);
        let startDateHours = 17 - pStart.getUTCHours();
        const startDateMinutes = pStart.getUTCMinutes();
        let startDayPlanned = 8;
        if (startDateHours <= 8) {
            let min = 0;
            if (startDateMinutes < 59 && startDateMinutes !== 0) {
                if (startDateHours === 8) {
                    startDateHours = 7;
                }
                min = Math.round(((60 - startDateMinutes) * 100) / 60) / 100;
            }
            startDayPlanned = startDateHours + min;
        }
        const days = (await this.getBusinessDateCount(pStart, pFinish)) - 2;
        const plannedEffortPerDay = parseInt(plannedEffort) / days;
        let plannedPerDay = plannedEffortPerDay.toFixed(2);
        if (plannedEffortPerDay > 8) {
            plannedPerDay = 8;
        }
        const endDayPlanned =
            parseInt(plannedEffort) - days * plannedPerDay - startDayPlanned;
        if (
            cStart.getMonth() >= pStart.getMonth() &&
            cStart.getYear() >= pStart.getYear() &&
            cStart.getMonth() <= pFinish.getMonth() &&
            cStart.getYear() <= pFinish.getYear()
        ) {
            let ar = await this.getDaysArray(pStart, pFinish);
            const arr = await this.getDaysArray(cStart, cEnd);
            ar = ar.concat(arr);
            const len = await this.toFindDuplicates(ar);
            let totalPlanned = len.length * plannedPerDay;
            let index = len.findIndex(
                (res) => res === moment(pStart).format('YYYY-MM-DD')
            );
            if (index > -1) {
                totalPlanned = totalPlanned - plannedPerDay + startDayPlanned;
            }

            index = len.findIndex(
                (res) => res === moment(pFinish).format('YYYY-MM-DD')
            );
            if (index > -1) {
                totalPlanned = totalPlanned - plannedPerDay + endDayPlanned;
            }

            return totalPlanned;
        } else {
            return 0;
        }
    }

    async toFindDuplicates(arr) {
        const sorted_arr = arr.slice().sort();
        const results = [];
        for (let i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        return results;
    }

    async getMilestones(id) {
        const task = await celoxisService.getMilestones(id);
        return task;
    }

    async getActiveProjectReport() {
        const field = [
            { label: 'Id', key: 'code' },
            { label: 'Project Name', key: 'projectname' },
            { label: 'Total Hours', key: 'totalhours' },
            { label: 'Deadline', key: 'deadline' },
            { label: 'Baseline %', key: 'baseline' },
            { label: 'Real Progress %', key: 'real' },
            { label: 'Total hours time entry', key: 'totalHours' },
            { label: 'Project value in $', key: 'projVal' }
        ];

        const project = await celoxisService.getCelxiosActiveProject();
        const projectData = [];

        for (let i = 0; i < project.length; i++) {
            const element = project[i];
            const {
                id,
                name,
                plannedEffort,
                deadline,
                baselinePercentComplete,
                actualPercentComplete,
                code
            } = element;

            let proj = await Project.findAll({
                attributes: [
                    'id',
                    'declaredIncome',
                    [
                        DB.sequelize.fn(
                            'sum',
                            DB.sequelize.col('Timesheets.timespent')
                        ),
                        'timespent'
                    ]
                ],
                include: [
                    {
                        model: Timesheet,
                        attributes: []
                    }
                ],
                group: ['Project.id'],
                where: { celoxisId: id }
            });

            proj = JSON.parse(JSON.stringify(proj));

            const object = {
                code: code,
                projectname: name,
                totalhours: plannedEffort,
                deadline: deadline,
                baseline: baselinePercentComplete,
                real: actualPercentComplete,
                totalHours: proj && proj[0] ? proj[0].timespent : 0,
                projVal: proj && proj[0] ? proj[0].declaredIncome : 0
            };
            projectData.push(object);
        }
        return { field, data: projectData };
    }

    async getProjectUserReport() {
        const field = [
            { label: 'User Name', key: 'username' },
            { label: 'Project Name', key: 'projectname' },
            { label: 'Timespent', key: 'timespent' }
        ];

        const data = await DB.sequelize.query(
            `SELECT  bb.name username,cc.name projectname, aa.timespent FROM (SELECT userid, projectid, SUM(timespent)timespent FROM Timesheets GROUP BY userid, projectid) aa LEFT JOIN
            Users bb ON aa.userid = bb.id LEFT JOIN Projects cc ON aa.projectId = cc.id
            WHERE bb.name IS NOT NULL AND cc.name IS NOT NULL
            ORDER BY username;`,
            { type: DB.Sequelize.QueryTypes.SELECT }
        );
        return { data, field };
    }

    async getMonthlyProjectReport() {
        const field = [
            { label: 'number', key: 'code' },
            { label: 'Client', key: 'clients' },
            { label: 'Projec Type', key: 'type' },
            { label: 'Desription', key: 'description' },
            { label: 'Planned Actual (KOM)', key: 'plannedPercentComplete' },
            {
                label: 'Planned end of the current month (realistic)',
                key: 'baselinePercentComplete'
            },
            { label: 'Actual', key: 'actualPercentCompleted' },
            {
                label: 'Forecasted (end next month) - realistic',
                key: 'forecasted'
            },
            { label: 'PM/LE', key: 'managers' },
            { label: 'CLOSING DATE (PLANNED)', key: 'plannedFinish' },
            { label: 'CURRENT SITUATION', key: 'currentSituation' },
            { label: 'RISKS', key: 'risk' },
            { label: 'IMMEDIATE OPPORTUNITIES', key: 'immediateOpp' },
            { label: 'Total Hours (Planned)', key: 'plannedEffort' },
            {
                label: 'Hours Consumed (Time Entry Report)',
                key: 'hoursConsumed'
            },
            { label: 'Number Engineers', key: 'numberEngineer' },
            { label: 'Engineers Involved', key: 'team' },
            { label: 'Engineers Needed', key: 'engineerNeeded' },
            { label: 'PM/ LE Involvement', key: 'pl_le_involvement' },
            { label: 'LAST INVOICE SUBMITTED', key: 'lastInvoiceSubmitted' },
            {
                label: 'NEXT INVOICE TO BE SUBMITTED',
                key: 'nextInvoiceToBeSubmitted'
            },
            { label: 'Software (HYSYS, UNISIM, etc)', key: 'custom_proc_sim' },
            { label: 'Number Needed vs. Actual', key: 'noNeededVsActual' },
            {
                label: 'Type (Direct Connect / Emulated)',
                key: 'custom_control_type'
            },
            {
                label: ' DCS Provider (& Associated Licenses)',
                key: 'custom_dcs_sim'
            }
        ];
        const celoxisData = await celoxisService.getCelxiosActiveProject();
        const data = [];
        console.log(celoxisData, 'celoxisData');
        for (const cel of celoxisData) {
            const {
                id,
                code,
                clients,
                type,
                description,
                plannedPercentComplete,
                baselinePercentComplete,
                actualPercentCompleted,
                managers,
                plannedFinish,
                risk,
                plannedEffort,
                team,
                custom_proc_sim,
                custom_control_type,
                custom_dcs_sim
            } = cel;
            const report = await DB.sequelize.query(
                `SELECT t1.*,sum(t2.timespent) as hoursConsumed FROM Projects as t1 left join Timesheets as t2 on t1.id= t2.projectId where t1.celoxisId=${id} group by t1.id;`,
                { type: DB.Sequelize.QueryTypes.SELECT }
            );
            const { hoursConsumed } = report;
            const milestone = await celoxisService.getMilestones(id);
            data.push({
                milestone,
                code,
                clients,
                type,
                description,
                plannedPercentComplete,
                baselinePercentComplete,
                actualPercentCompleted,
                managers,
                plannedFinish,
                risk,
                plannedEffort,
                team,
                custom_proc_sim,
                custom_control_type,
                custom_dcs_sim,
                hoursConsumed
            });
        }
        return { field, data };
    }
}
module.exports = ProjectRepository;
