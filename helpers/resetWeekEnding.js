const moment = require('moment')
const CronJob = require('cron').CronJob;
const Sites = require('../models/sites')
const WeeklyStatements = require('../models/weeklyStatement')

const restatWeekEnding = () => {
    let job = new CronJob('50 * * * * *', async function() {
        let date = new Date()

        if(date.getDay() == 7) {
            let weekEnding = moment().day(-7).format('YYYY MMMM DD')
            console.log(weekEnding)
            console.log(date.getDay(), date)
            let sites = await Sites.find()

            let check = await WeeklyStatements.find({ weekEnding: weekEnding })
            console.log(check, check.length)
            if(check.length > 0) {
                return console.log('Already Stored!')
            } 

            let newWeekly = new WeeklyStatements({
                weekEnding: weekEnding,
                data: sites
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
        
        //console.log(sites)        

    }, null, true, 'America/Los_Angeles');
    job.start();

}

module.exports = restatWeekEnding
