const express = require('express')
const jwt = require('jsonwebtoken')
const Sites = require('../models/sites')

const router = express.Router();
const uuid = require('uuid-v4')

router.get('/get', async (req, res) => {

  let site = await Sites.find({ _id: req.query.id })
  res.send(site)
});

router.get('/all', (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
      Sites.find().then(result => res.status(200).send(result));
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
          Sites.findOneAndUpdate({ _id: req.body.data._id }, req.body.data)
            .then(result => res.status(200).send(result))
            .catch(err => res.status(400).send(err));
          res.status(200);
          break;
        case 'create':
          console.log(req.body.data)
          if (req.body.data.companyName === undefined) return res.status(400).send('the site needs a valid companyName...')
          if (req.body.data.companyName.length < 3) return res.status(400).send('the site needs a valid companyName...')

          const item = new Sites(req.body.data);
          item.save()
            .then(result => res.status(200).send(result))
            .catch(err => res.status(400).send());
          res.send('site created...')
          break;
        default:
          break;
      }
    } else {
      res.status(403).send("You don't have access");
    }
  });
});

router.put('/add-worker', async (req, res) => {
  const site = await Sites.findById({ _id: req.body.siteId })
  if (!site) return res.status(500).send('Somthing went wrong! Please try again!')

  let worker = site.workers.find(item => item.worker._id === req.body.newWorker._id)
  req.body.newWorker.weId = uuid()
  let response = await Sites.findByIdAndUpdate({ _id: req.body.siteId }, {
    '$push': {
      'workers': {
        worker: req.body.newWorker,
        rates: req.body.rates
      }
    }
  }, { new: true })

  res.send(response)
})

router.delete('/delete', async (req, res) => {
  console.log('delete site attempt', req.body)
  const token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(token, 'secretkey', async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
      let site = await Sites.findOneAndRemove({ _id: req.body._id })
      console.log(site)
      if (site) {
        // site.remove()
        // site.save()
        let response = await Sites.find()
        res.status(200).send(response)
      } else {
        res.send('no site was found')
      }

    } else {
      res.status(403).send("You don't have access");
    }
  });
})

router.put('/add-hours', async (req, res) => {
  let site = await Sites.find({ _id: req.body.siteId })
  if (!site) return res.send('no site with this id was found')
  let newWorkers = site[0].workers

  let worker = site[0].workers.find(item => item.worker.weId === req.body.id)
  let index = site[0].workers.indexOf(worker)

  if (makeFloat(worker.worker.hours) > 0 && makeFloat(req.body.hours) === 0) {

  } else {
    worker.worker.hours = req.body.hours
  }

  newWorkers[index] = worker

  let response = await Sites.findOneAndUpdate({ _id: req.body.siteId }, { workers: newWorkers }, { new: true })

  res.send(response)
})

router.put('/add-category', async (req, res) => {
  let site = await Sites.find({ _id: req.body.siteId })
  if (!site) return res.send('no site with this id was found')
  let newWorkers = site[0].workers

  let worker = site[0].workers.find(item => item.worker.weId === req.body.weId)
  let index = site[0].workers.indexOf(worker)
  worker.worker.category = req.body.category

  newWorkers[index] = worker

  let response = await Sites.findOneAndUpdate({ _id: req.body.siteId }, { workers: newWorkers }, { new: true })

  res.send(response)
})

router.put('/update-rates', async (req, res) => {
  let site = await Sites.find({ _id: req.body.siteId })
  if (!site) return res.send('nope')
  let newWorkers = site[0].workers

  let worker = site[0].workers.find(item => item.worker.weId === req.body.id)
  let index = site[0].workers.indexOf(worker)
  if (makeFloat(worker.rates.rateGot) > 0 && makeFloat(req.body.ratesData.rateGot) === 0) {

  } else {
    worker.rates.rateGot = req.body.ratesData.rateGot
  }

  if (makeFloat(worker.rates.ratePaid) > 0 && makeFloat(req.body.ratesData.ratePaid) === 0) {

  } else {
    worker.rates.ratePaid = req.body.ratesData.ratePaid
  }

  newWorkers[index] = worker

  let response = await Sites.findOneAndUpdate({ _id: req.body.siteId }, { workers: newWorkers }, { new: true })

  res.send(response)
})

router.put('/payment-status', async (req, res) => {
  let site = await Sites.find({ _id: req.body.siteId })
  if (!site) return res.send('no site with this id was found')
  let newWorkers = site[0].workers

  let worker = site[0].workers.find(item => item.worker._id === req.body.id)
  let index = site[0].workers.indexOf(worker)
  worker.worker.paymentStatus = 'Yes'

  newWorkers[index] = worker

  let response = await Sites.findOneAndUpdate({ _id: req.body.siteId }, { workers: newWorkers }, { new: true })

  res.send(response)
})

router.post('/remove-worker', async (req, res) => {
  const site = await Sites.find({ _id: req.body.siteId })
  if (!site) return res.status(500).send('Somthing went wrong! Please try again!')

  let worker = site[0].workers.find(item => item.worker.weId === req.body.weId)
  let index = site[0].workers.indexOf(worker)

  site[0].workers.splice(index, 1)

  let response = await Sites.findByIdAndUpdate({ _id: req.body.siteId }, site[0], { new: true })

  res.send(response)
})

router.put('/update-status', async (req, res) => {
  let newStatus = req.body.value
  let site = await Sites.findOneAndUpdate({ _id: req.body.id }, { status: newStatus }, { new: true })

  let response = await Sites.find()
  res.send(response)
})

module.exports = router;

const makeFloat = (nr) => {
  if (typeof nr === 'number') nr = nr.toString()
  if (typeof nr === "undefined") nr = '0,0'
  let test = nr.split('.').join('')
  test = test.replace('\,', '.')

  return test
}