const moment = require('moment')
const CronJob = require('cron').CronJob;
const Sites = require('../models/sites')
const WeeklyStatements = require('../models/weeklyStatement')

const restatWeekEnding = () => {
  let job = new CronJob('59 50 23 * * *', async function () {
    let date = new Date()

    //Check if is Sunday
    if (date.getDay() == 0) {
      let weekEnding = moment().day(7).format('YYYY MMMM DD')
      let previousWeekEnding =  moment().day(0).format('YYYY MMMM DD')

      let check = await WeeklyStatements.find({ weekEnding: weekEnding })
      if (check.length > 0) {
        return console.log('Already Stored!')
      }

      let previousData = await WeeklyStatements.find({ weekEnding: previousWeekEnding })
      let newData = generateNewData(previousData)

      let newWeekly = new WeeklyStatements({
        weekEnding: weekEnding,
        data: newData
      })
      newWeekly = await newWeekly.save()
    }

  }, null, true, 'Europe/Bucharest')
  job.start()

}

const generateNewData = (data) => {
  let { data: sites } = data

  for (let i = 0; i < sites.length; i++) {
    for (let j = 0; j < sites[i].workers.length; j++) {
      if (sites.workers[j].worker.selected === undefined) {
        sites.workers[j].worker.selected === true
      }

      if (sites.workers[j].worker.selected === false) {
        workers.slice(j, 1)
      }
    }
  }

  for (let i = 0; i < sites.length; i++) { 
    if(sites[i].workers.length < 1) {
      sites.slice(i, 1)
    }
  }

  return sites
}

module.exports = restatWeekEnding
