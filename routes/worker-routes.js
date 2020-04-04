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
    //console.log(req.body)
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent' || authData.user.role === 'sourcer') {
            switch (req.body.action) {
                case 'edit':
                    // HERE WE'LL HAVE THE UPDATED USER

                    const oldWorker = await Workers.findOne({ _id: req.body.data._id }).exec();

                    const oldSite = await Sites.findOne({ _id: oldWorker.site._id }).exec();

                    oldSite.workers = oldSite.workers.filter(worker => worker._id !== oldWorker._id.toString());

                    await Sites.findOneAndUpdate({ _id: oldSite._id }, { workers: oldSite.workers }).exec();

                    const newSite = await Sites.findOne({ _id: req.body.data.site._id }).exec();

                    newSite.workers = [...newSite.workers, req.body.data];

                    Sites.findOneAndUpdate({ _id: newSite._id }, { workers: newSite.workers }).exec();

                    let newData = req.body.data
                    delete newData._id
                    console.log(newData)

                    await Workers.findOneAndUpdate({ email: req.body.data.email }, newData)
                        .then(result => res.status(200).send(result))
                        .catch(err => {
                            console.log(err)
                            res.status(400).send('aici e ceva naspa')});
                    res.status(200);
                    break;
                case 'create':
                    const item = new Workers(req.body.data);
                    item.save()
                        .then(async result => {
                            const site = await Sites.findOne({ _id: result.site._id }).exec();
                            site.workers = [...site.workers, result];
                            Sites.findByIdAndUpdate({ _id: site._id }, { workers: site.workers });
                            return res.status(200).send('new worker created...');
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(400).send('no bene')
                        });
                    break;
                default:
                    break;
            }
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.put('/add-hours', async (req, res) => {
    let worker = await Workers.find({ _id: req.body.id })
    if(!worker) return res.send('no worker with this id was found')

    worker = await Workers.findByIdAndUpdate({ _id: req.body.id }, { hours: req.body.hours, hoursOT: req.body.hoursOT }, { new: true })
    res.send(worker)
})

module.exports = router;
