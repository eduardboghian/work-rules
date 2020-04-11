const router = require('express').Router()
const WeeklyStatements = require('../models/weeklyStatement')

router.get('/get/:id', async (req, res)=> {
    let data = await WeeklyStatements.find({ _id: req.params.id })

    res.send(data)
})

router.get('/get-all', async (req, res)=> {
    let data = await WeeklyStatements.find()

    res.send(data)
})

router.post('/add', async (req, res) => {
    let check = await WeeklyStatements.find({ weekEnding: req.body.weekEnding })
    if(check) return res.send('Already Stored!')

    let data = new WeeklyStatements(req.body)
    data = await data.save()

    res.send('Successfully Stored!')
})

module.exports = router