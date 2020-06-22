const moment = require('moment')
const CronJob = require('cron').CronJob;
const Sites = require('../models/sites')
const WeeklyStatements = require('../models/weeklyStatement')

const restatWeekEnding = () => {
  let job = new CronJob('59 50 23 * * *', async function () {
    let date = new Date()
    console.log(date, 'and the day is ', date.getDay())

    if (date.getDay() == 0) {
      let weekEnding = moment().day(7).format('YYYY MMMM DD')
      console.log(weekEnding)
      let sites = await Sites.find()

      let check = await WeeklyStatements.find({ weekEnding: weekEnding })
      console.log(check, check.length)
      if (check.length > 0) {
        return console.log('Already Stored!')
      }

      let newWeekly = new WeeklyStatements({
        weekEnding: weekEnding,
        data: []
      })
      newWeekly = await newWeekly.save()

      for (let index = 0; index < sites.length; index++) {
        let site = sites[index];
        for (let index = 0; index < site.workers.length; index++) {
          const element = site.workers[index];
          element.worker.hours = 0
          element.worker.hoursOT = 0
        }
        await Sites.findOneAndUpdate({ _id: site._id }, site, { new: true })
      }

    }


  }, null, true, 'Europe/Bucharest')
  job.start()

}

module.exports = restatWeekEnding
