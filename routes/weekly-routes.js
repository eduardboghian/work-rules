const router = require('express').Router()
const uuid = require('uuid-v4')
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

const makeFloat = (nr) => {
    if (typeof nr === 'number') nr = nr.toString()
    if (typeof nr === "undefined") nr = '0,0'
    let test = nr.split('.').join('')
    test = test.replace('\,', '.')

    return test
}