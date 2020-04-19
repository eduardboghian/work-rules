const router = require('express').Router()
const WeeklyStatements = require('../models/weeklyStatement')

router.get('/get/:id', async (req, res)=> {
    let data = await WeeklyStatements.find({ _id: req.params.id })

    res.send(data)
})

router.get('/get-all', async (req, res)=> {
    let data = await WeeklyStatements.find()
    data = data.slice().sort((a, b) => b.date - a.date)

    res.send(data)
})

router.post('/add', async (req, res) => {
    let check = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if(check) return res.send('Already Stored!')

    let data = new WeeklyStatements(req.body)
    data = await data.save()

    res.send('Successfully Stored!')
})

router.put('/add-hours', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if(!we) return res.send('no site with this id was found')
    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)

    let worker = site.workers.find( item => item.worker._id === req.body.id )
    let index = site.workers.indexOf(worker)
    worker.worker.hours = req.body.hours
    worker.worker.hoursOT = req.body.hoursOT

    site.workers[index] = worker

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.put('/update-rates', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if(!we) return res.send('no site with this id was found')
    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)

    let worker = site.workers.find( item => item.worker._id === req.body.id )
    let index = site.workers.indexOf(worker)
    worker.rates = req.body.ratesData

    site.workers[index] = worker

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})


module.exports = router