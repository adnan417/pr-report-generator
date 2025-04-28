const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');

module.exports.getWeekRange = ()=>{

    dayjs.extend(isoWeek);

    const startDate = dayjs().startOf('isoWeek').toISOString(); //Monday date
    const endDate = dayjs().startOf('isoWeek').add(5, 'day').endOf('day').toISOString();

    return {startDate,endDate};
}