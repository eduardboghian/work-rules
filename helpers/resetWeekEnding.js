const moment = require('moment')
const CronJob = require('cron').CronJob;
const Sites = require('../models/sites')
const WeeklyStatements = require('../models/weeklyStatement')

const restatWeekEnding = () => {
  let job = new CronJob('59 50 23 * * *', async function () {
    let date = new Date()

    //Check if is Sunday
    if (date.getDay() == 1) {
      let weekEnding = moment().day(7).format('YYYY MMMM DD')
      let previousWeekEnding =  moment().day(0).format('YYYY MMMM DD')

      let check = await WeeklyStatements.find({ weekEnding: weekEnding })
      if (check.length > 0) {
        return console.log('Already Stored!')
      }

      let previousData = await WeeklyStatements.findOne({ weekEnding: previousWeekEnding })
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

const generateNewData = (weData) => {
  let { data: sites } = weData

  for (let i = 0; i < sites.length; i++) {
    for (let j = 0; j < sites[i].workers.length; j++) {
      if (sites[i].workers[j].worker.selected === undefined) {
        sites[i].workers[j].worker.selected === true
      }

      if (sites[i].workers[j].worker.selected === false) {
        sites[i].workers.splice(j, 1)
      } else {
        sites[i].workers[j].worker.hours = '0,0'
      }
    }
  }

  for (let i = 0; i < sites.length; i++) { 
    if(sites[i].workers.length < 1) {
      sites.splice(i, 1)
    }
  }

  return sites
}

module.exports = restatWeekEnding
