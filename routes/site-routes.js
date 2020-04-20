const express = require('express');
const jwt = require('jsonwebtoken');

const Clients = require('../models/clients');
const Sites = require('../models/sites')

const router = express.Router();

router.get('/get', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent' || authData.user.role === 'sourcer') {
            Sites.find().then(result => res.status(200).send(result));
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.post('/all', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
            Clients.findOne({_id: req.body._id}).then(result => res.status(200).send(result));
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.post('/add', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
            switch (req.body.action) {
                case 'edit':
                    Sites.findOneAndUpdate({ email: req.body.data.email }, req.body.data)
                        .then(result => res.status(200).send())
                        .catch(err => res.status(400).send());
                    res.status(200);
                    break;
                case 'create':
                    const item = new Sites(req.body.data);
                    item.save()
                        .then(result => res.status(200).send(result))
                        .catch(err => res.status(400).send());
                    break;
                default:
                    break;
            }
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.put('/add-worker', async (req, res)=> {
    const site = await Sites.findById({_id: req.body.siteId})
    if(!site)return res.status(500).send('Somthing went wrong! Please try again!')

    let worker = site.workers.find( item => item.worker._id === req.body.newWorker._id )
    console.log(worker)
    if (!worker) {
      let response = await Sites.findByIdAndUpdate({ _id: req.body.siteId },{ '$push': { 'workers': {
          worker: req.body.newWorker,
          rates: req.body.rates
      } } },{ new: true })

      res.send(response)
    }else {
      res.send('worker already on this site')
    }
})

router.delete('/delete', async (req, res) => {
    console.log('delete site attempt', req.body)
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
            let site = await Sites.findOne({_id: req.body._id})
            if (site) {
                site.remove()
                site.save()
                res.status(200).send('site deleted')
            }else {
                res.send('no site was found')
            }

        } else {
            res.status(403).send("You don't have access");
        }
    });
})

router.put('/add-hours', async (req, res) => {
    let site = await Sites.find({ _id: req.body.siteId })
    if(!site) return res.send('no site with this id was found')
    let newWorkers = site[0].workers

    let worker = site[0].workers.find( item => item.worker._id === req.body.id )
    let index = site[0].workers.indexOf(worker)
    worker.worker.hours = req.body.hours
    worker.worker.hoursOT = req.body.hoursOT

    newWorkers[index] = worker

    let response = await Sites.findOneAndUpdate({ _id: req.body.siteId }, { workers: newWorkers }, { new: true })

    res.send(response)
})

router.put('/update-rates', async (req, res) => {
    let site = await Sites.find({ _id: req.body.siteId })
    if(!site) return res.send('nope')
    let newWorkers = site[0].workers

    let worker = site[0].workers.find(item => item.worker._id === req.body.id)
    let index = site[0].workers.indexOf(worker)
    worker.rates = req.body.ratesData

    newWorkers[index] = worker

    let response = await Sites.findOneAndUpdate({_id: req.body.siteId}, {workers: newWorkers}, {new: true})

    res.send(response)
})

router.put('/payment-status', async (req, res) => {
    let site = await Sites.find({ _id: req.body.siteId })
    if(!site) return res.send('no site with this id was found')
    let newWorkers = site[0].workers

    let worker = site[0].workers.find( item => item.worker._id === req.body.id )
    let index = site[0].workers.indexOf(worker)
    worker.worker.paymentStatus = 'Yes'

    newWorkers[index] = worker

    let response = await Sites.findOneAndUpdate({ _id: req.body.siteId }, { workers: newWorkers }, { new: true })

    res.send(response)
})

router.post('/remove-worker', async (req, res) => {
    const site = await Sites.find({_id: req.body.siteId})
    if(!site)return res.status(500).send('Somthing went wrong! Please try again!')

    let worker = site[0].workers.find( item => item.worker._id === req.body.uid )
    let index = site[0].workers.indexOf(worker)

    site[0].workers.splice(index, 1)

    await Sites.findByIdAndUpdate({ _id: req.body.siteId },site[0] ,{ new: true })

    res.send('Removed Successfully!')
})

router.put('/update-status', async (req, res) => {
    let newStatus = req.body.value

    let site = await Sites.findOneAndUpdate({ _id: req.body.id }, { status: newStatus }, { new: true })

    res.send(site)
})

module.exports = router;
