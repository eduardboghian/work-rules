const express = require('express');
const jwt = require('jsonwebtoken');

const Workers = require('../models/workers');
const Sites = require('../models/sites');

const router = express.Router();

router.get('/get', (req, res) => {
    Workers.find().sort({ site: 1 })
    .then(result => {
        res.status(200).send(result)
    });
});

router.post('/add', async (req, res) => {
    
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent' || authData.user.role === 'sourcer') {
            switch (req.body.action) {
                case 'edit':
                    // HERE WE'LL HAVE THE UPDATED USER
                    let response = await Workers.findOneAndUpdate({ _id: req.body.data._id }, req.body.data, { new:true })
                    res.status(200).send(response);
                    break;
                case 'create':
                    const item = new Workers(req.body.data);
                    item.save()
                    res.send(item)
                    break;
                default:
                    break;
            }
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.put('/add-trade', async (req, res) => {
    let worker = await Workers.find({ _id: req.body.uid })
    worker = worker[0]
    if(!worker) return res.send('Something went wrong, please try again!')
    let trades

    if(worker.trades === undefined) {
        trades = []
    }else {
        trades = worker.trades
    }

    trades.push(req.body.trade)


    worker = await Workers.findOneAndUpdate({ _id: req.body.uid }, { trades } , { new: true })
    res.send(worker)
})

router.post('/delete-ticket', async (req, res) => {
    let worker = await Workers.find({ _id: req.body.uid })
    worker = worker[0]
    if(!worker) return res.send('Something went wrong, please try again!')
    let tickets = worker.tickets

    let index = tickets.indexOf(req.body.ticket)
    tickets.splice(index, 1)

    worker = await Workers.findOneAndUpdate({ _id: req.body.uid }, { tickets }, { new: true })
    res.send(worker)
})

module.exports = router;
