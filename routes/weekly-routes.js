const router = require('express').Router()
const { WeeklyStatements } = require('../models/weeklyStatement')

router.get('/get/:id', async (req, res)=> {
    let data = await WeeklyStatements.find({ _id: req.params.id })

    res.send(data)
})

router.get('/get-all', async (req, res)=> {
    let data = await WeeklyStatements.find()

    res.send(data)
})

router.post('/add', async (req, res) => {
    const data
})