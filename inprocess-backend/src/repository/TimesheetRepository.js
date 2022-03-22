/* eslint-disable prettier/prettier */
const moment = require('moment');
const Sequelize = require('sequelize');

const Timesheet = require('../models').Timesheet;
const User = require('../models').User;
const UserTask = require('../models').UserTask;
const SettingService = require('../services').settingService;
const { getIsEditData, isEditData, getTimeSheetList, unique } = require('../helper/timeSheetHelper');

const settingService = new SettingService();
const Op = Sequelize.Op;

moment.updateLocale('en', {
    week: {
        dow: 1
    }
});

class TimesheetRepository {
    async create(userId, timesheetData) {
        timesheetData = timesheetData.timesheet;
        try {
            if (timesheetData.length) {
                const insertBulkTimesheet = [];
                let allPromises = [];

                for (const timesheet of timesheetData) {
                    const { taskId, date } = timesheet;
                    const deleteTimesheet = Timesheet.destroy({ where: { userId, date } });
                    allPromises.push(deleteTimesheet);
                }

                await Promise.all(allPromises);
                allPromises = [];

                let insertTimesheetRecords = timesheetData.filter(
                    (timesheet) => !timesheet.isDeleted
                );
                console.log(insertTimesheetRecords, "------------");
                const userSetting = await settingService.getSystemDate();
                for (let index = 0; index < insertTimesheetRecords.length; index++) {
                    const {
                        projectId,
                        parentTaskId,
                        taskId,
                        date,
                        timespent
                    } = insertTimesheetRecords[index];
                    const [year, month, dateOfMonth] = date.split('-');
                    const timesheetDate = moment()
                        .utc()
                        .set({ year, month: month - 1, date: dateOfMonth });
                    const isBeforeMonth = moment(timesheetDate)
                        .utc()
                        .isBefore(moment().utc(), 'month');

                    if (isBeforeMonth) {
                        const isAllow = await isEditData(userSetting, date);
                        if (!isAllow) {
                            continue;
                        }
                    }

                    insertBulkTimesheet.push({
                        projectId, parentTaskId,
                        taskId, userId, date, timespent
                    });
                }
                if (insertBulkTimesheet.length) {
                    // INSERT NEW TIMESHEET
                    const bulkcreate = Timesheet.bulkCreate(insertBulkTimesheet, { returning: true });
                    allPromises.push(bulkcreate);
                }
                const userTimeUpdate = await User.update(
                    { timesheetLastUpdated: new Date() },
                    { where: { id: userId } }
                );
                allPromises.push(userTimeUpdate);
                await Promise.all(allPromises);
            }
            return [];

        } catch (err) {
            console.log('error message here is ', err);
            throw err;
        }
    }

    async timesheets(data) {
        let timesheets = null, userTasks = null;
        let startDate = moment().startOf('week');
        let endDate = moment().endOf('week');
        if (data.startDate) {
            startDate = moment(data.startDate, 'YYYY-MM-DD');
        }
        if (data.endDate) {
            endDate = moment(data.endDate, 'YYYY-MM-DD');
        }

        try {
            timesheets = await Timesheet.findAll({
                where: {
                    date: {
                        [Op.between]: [
                            startDate.format('YYYY-MM-DD'),
                            endDate.format('YYYY-MM-DD')
                        ]
                    },
                    userId: data.userId
                },
                attributes: ['timespent', 'date', 'taskId', 'projectId', 'userId', 'parentTaskId']
            });

            userTasks = await UserTask.findAll({
                where: {
                    userId: data.userId
                },
                attributes: ['projectId', 'taskId', 'userId']
            });

            if (!timesheets) {
                return res.status(204).json({
                    success: false,
                    message: 'No timesheet found.'
                });
            }

            timesheets = JSON.parse(JSON.stringify(timesheets));

            if (userTasks) {
                userTasks = JSON.parse(JSON.stringify(userTasks));
                timesheets = timesheets.map((timesheet) => {
                    const newUserTasks = userTasks.filter((userTask) =>
                        userTask.userId === timesheet.userId &&
                        userTask.projectId === timesheet.projectId &&
                        (userTask.taskId === timesheet.taskId || 
                        userTask.taskId === timesheet.parentTaskId)
                        // userTask.taskId === timesheet.taskId

                    );
                    if (Array.isArray(newUserTasks) && newUserTasks.length) {
                        return { ...timesheet, isAssigned: true };
                    }
                    return { ...timesheet, isAssigned: false };
                });
            }

            const unionArray = unique(timesheets, ['taskId', 'projectId', 'parentTaskId']);

            unionArray.map(item => {
                const filteredArr = timesheets.filter((timesheet) =>
                    timesheet.userId === item.userId &&
                    timesheet.projectId === item.projectId &&
                    timesheet.taskId === item.taskId &&
                    timesheet.parentTaskId === item.parentTaskId
                );

                if (Array.isArray(filteredArr) && filteredArr.length) {
                    return item.timesheets = filteredArr
                }
                return item
            })

            const userSetting = await settingService.getSystemDate();
            let assigned = unionArray.filter(
                (item) => item.isAssigned === true
            );
            let unAssigned = unionArray.filter(
                (item) => item.isAssigned === false
            );

            assigned = getTimeSheetList(assigned, 'assigned', startDate);
            assigned = getIsEditData(assigned, userSetting);

            unAssigned = getTimeSheetList(unAssigned, 'unassigned', startDate);
            unAssigned = getIsEditData(unAssigned, userSetting);

            const user = await User.findOne({ where: { id: data.userId } });

            const isUpdateAllow = await settingService.validateDateTime(startDate, endDate);

            return {
                isUpdateAllow,
                timesheetLastUpdated: user.timesheetLastUpdated && moment(new Date(user.timesheetLastUpdated)).fromNow(),
                assigned,
                unAssigned
            };
        } catch (error) {
            console.log('error message here we have ', error);
            throw error;
        }
    }


}
module.exports = TimesheetRepository;
