const moment = require('moment');

const ASSIGNED_TASK_SIZE= 5;
const UNASSIGNED_TASK_SIZE= 1;
function isEditData(userSetting,isEdit_date){
    const isEditDate= moment.utc(isEdit_date, 'YYYY-MM-DD');
    const currentDate= moment.utc();
    const {
        dayOfAMonth: date,
        timeOfAMonth
    } = userSetting.dataValues;
    const hours = timeOfAMonth.getUTCHours();
    const minutes = timeOfAMonth.getUTCMinutes();
    const seconds = timeOfAMonth.getUTCSeconds();
    const lastEditDate = moment().utc().set({
        date,
        hours,
        minutes,
        seconds
    });  

    if(!userSetting.dateOvveride)
    {
        return true;
    }
    
    if(currentDate.isAfter(lastEditDate)){
        if(isEditDate.isBefore(lastEditDate) && 
           moment(isEditDate).format("M") < moment(lastEditDate).format("M")){
                return false;
            }else{
                return true;
        }        
    } else {
        const monthDiff =  diff_months(lastEditDate,isEditDate);
        if(isEditDate.isBefore(lastEditDate) && 
                                monthDiff > 1 
            ){
             return false;
        }else{
             return true;
        } 
    }    
}

function diff_months(d2, d1) 
{ 
    let date1 = new Date(d1);  
    let date2 = new Date(d2);  
    let years = yearsDiff(d1, d2);  
    let months =(years * 12) + (date2.getMonth() - date1.getMonth()) ; 
    return months;
}

function yearsDiff(d1, d2) {    
    let date1 = new Date(d1);    
    let date2 = new Date(d2);    
    let yearsDiff =  date2.getFullYear() - date1.getFullYear();    
    return yearsDiff;
}

function getTimeSheetList(taskList,name, startDate){
    let len = taskList.length;
    const limit = name === "assigned" ?  ASSIGNED_TASK_SIZE : UNASSIGNED_TASK_SIZE;     // To create the fix default list

    taskList.map(todo => {   
        todo['timesheets']= getTimesheetsData(todo.timesheets,startDate);;
        return todo;
    })

    for (let i = len; i < limit; i++) { //To create dummy data  
        taskList.push({ projectId: null, taskId: null,isAssigned: true, timesheets:getTimesheetsData(null,startDate)});               
    } 
    
    return taskList;
}

const getTimesheetsData = (data, startDate) =>{
    const timesheet = [];
    for (let i = 0; i < 7; i++) {
        let stDate = new Date(startDate);
        stDate.setDate(stDate.getDate() + i);
        timesheet.push(getValue(data,stDate))
    }
    return timesheet;
}

const getValue = (data, date) => {
    if (data) {
        let index = data.findIndex(ar => ar.date === moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'))
        if (index > -1)
            return { timespent: data[index].timespent, date: moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),isEdit: data[index].isEdit };
    }
    return { timespent: '0', date: moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')};
}
    
function getIsEditData(key,userSetting){
    key.map(data =>{                
        return data['timesheets'].map(todo => 
            todo['isEdit'] = !userSetting.dateOvveride ? true :  isEditData(userSetting, todo.date)) 
    })
    return key;
}

function unique(arr,props){
    return [...new Map(arr.map(entry => [props.map(k => entry[k]).join('|'), entry])).values()];
}

module.exports ={isEditData, getTimeSheetList, getIsEditData,unique};