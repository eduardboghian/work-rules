const router = require('express').Router()
const uuid = require('uuid-v4')
const moment = require('moment')
const WeeklyStatements = require('../models/weeklyStatement')

router.get('/get/:id', async (req, res) => {
    let data = await WeeklyStatements.find({ _id: req.params.id })

    res.send(data)
})

router.get('/get-all', async (req, res) => {
    let data = await WeeklyStatements.find()
    data = data.slice().sort((a, b) => b.date - a.date)

    res.send(data)
})

router.post('/add', async (req, res) => {
    let check = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if (check) return res.send('Already Stored!')

    let data = new WeeklyStatements(req.body)
    data = await data.save()

    res.send('Successfully Stored!')
})

router.put('/add-hours', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if (!we) return res.send('no site with this id was found')
    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)

    let worker = site.workers.find(item => item.worker.weId === req.body.id)
    let index = site.workers.indexOf(worker)

    worker.worker.hours = req.body.hours
    site.workers[index] = worker

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.put('/update-rates', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if (!we) return res.send('no site with this id was found')

    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)

    let worker = site.workers.find(item => item.worker.weId === req.body.id)
    let index = site.workers.indexOf(worker)
    worker.rates = req.body.ratesData

    site.workers[index] = worker

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.post('/update-checkbox', async (req, res) => {
    const { checked, site, worker, weekEnding, prevWeekEnding } = req.body
    
    let weeklyStatement = await WeeklyStatements.findOne({ weekEnding })
    if(!weeklyStatement) {
        let newWeekEnding = new WeeklyStatements({ weekEnding, data: [] })
        weeklyStatement = await newWeekEnding.save()
    }

    let nextWeekSite = weeklyStatement.data.find(item => item._id === site._id)
    if(!nextWeekSite) nextWeekSite = {...site, workers: [ worker ]}
    else {
        let nextWorker = nextWeekSite.workers.find(item => item.worker.weId === worker.worker.weId)
        if(!nextWorker) nextWeekSite.workers.push(worker)
    }

    let siteIndex = weeklyStatement.data.indexOf(nextWeekSite)
    if(siteIndex >= 0) weeklyStatement.data[siteIndex] = nextWeekSite
    else weeklyStatement.data.push(nextWeekSite)

    const response = await WeeklyStatements.findOneAndUpdate({weekEnding}, {data: weeklyStatement.data}, {new: true})

    updateCheckbox( prevWeekEnding, site._id, worker.worker.weId)
    
    res.send(response)
})

router.put('/add-category', async (req, res) => {
    console.log(req.body)
    let we = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if (!we) return res.send('no site with this id was found')
    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)

    let worker = site.workers.find(item => item.worker.weId === req.body.weId)
    let index = site.workers.indexOf(worker)
    worker.worker.category = req.body.category

    site.workers[index] = worker

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.put('/add-worker', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: `${req.body.weekEnding}` })
    if (!we) return res.send('no site with this id was found')
    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)
    req.body.newWorker.weId = uuid()

    site.workers.push({
        worker: req.body.newWorker,
        rates: req.body.rates
    })

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.put('/add-site', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: `${req.body.weekEnding}` })
    if (!we) return res.send('no site with this id was found')

    let check = we[0].data.filter(site => site._id === req.body.newSite._id)
    console.log('check', check)
    let sameWe = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    sameWe = sameWe[0]

    if (check.length > 0) return res.send(sameWe)
    req.body.newSite.workers = []
    we[0].data.push(req.body.newSite)

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.put('/remove-site', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: `${req.body.weekEnding.weekEnding}` })
    if (!we) return res.send('no site with this id was found')
    //we[0].data.push(req.body.newSite)
    console.log(req.body, we)
    let site = we[0].data.filter(site => site._id === req.body.removedSite._id)
    site = site[0]
    let siteIndex = we[0].data.indexOf(site)

    we[0].data.splice(siteIndex, 1)

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding.weekEnding }, we[0], { new: true })
    res.send(response)
})

router.put('/remove-worker', async (req, res) => {
    let we = await WeeklyStatements.find({ weekEnding: `${req.body.weekEnding}` })
    if (!we) return res.send('no site with this id was found')
    let site = we[0].data.find(item => item._id == req.body.siteId)
    let siteIndex = we[0].data.indexOf(site)

    let worker = site.workers.find(item => item.worker.weId === req.body.weId)
    let index = site.workers.indexOf(worker)
    site.workers.splice(index, 1)

    we[0].data[siteIndex] = site

    let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding }, we[0], { new: true })
    res.send(response)
})

module.exports = router

const updateCheckbox = async (weekEnding, siteId, id) => {
    let we = await WeeklyStatements.findOne({ weekEnding })
    if (!we) return res.send('no site with this id was found')

    let site = we.data.find(item => item._id == siteId)
    let siteIndex = we.data.indexOf(site)

    let worker = site.workers.find(item => item.worker.weId === id)
    let index = site.workers.indexOf(worker)
    worker.worker.selected = true

    site.workers[index] = worker
    we.data[siteIndex] = site

    await WeeklyStatements.findOneAndUpdate({ weekEnding }, we, { new: true })
}