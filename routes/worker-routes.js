const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer')

const Workers = require('../models/workers');

const router = express.Router();

// MULTER CONFIGURATION

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

// APIs

router.get('/get', (req, res) => {
  Workers.find()
    .sort({ firstname: 1 })
    .then(result => {
      res.status(200).send(result)
    });
});

router.get('/get-id', async (req, res) => {
  let worker = await Workers.find({ _id: req.query.userID })

  res.send(worker)
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
          let response = await Workers.findOneAndUpdate({ _id: req.body.data._id }, req.body.data, { new: true })
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
  console.log('trade update', req.body)
  let worker = await Workers.find({ _id: req.body.uid })
  worker = worker[0]
  if (!worker) return res.send('Something went wrong, please try again!')
  let trades

  if (worker.trades === undefined) {
    trades = []
    trades.push({
      weId: req.body.weId,
      weekEnding: req.body.weekEnding,
      value: req.body.trade
    })
  } else {
    trades = worker.trades
  }

  let check = trades.filter(trade => trade.weId === req.body.weId)
  if (check.length > 0) {
    let index = trades.indexOf(check[0])
    trades[index].value = req.body.trade
  }
  else {
    trades.push({
      weId: req.body.weId,
      weekEnding: req.body.weekEnding,
      value: req.body.trade
    })
  }

  worker = await Workers.findOneAndUpdate({ _id: req.body.uid }, { trades }, { new: true })
  res.send(worker)
})

router.put('/remove-trade', async (req, res) => {
  console.log('trade update', req.body)
  let worker = await Workers.find({ _id: req.body.uid })
  worker = worker[0]
  if (!worker) return res.send('Something went wrong, please try again!')
  let trades = worker.trades
  let check = trades.filter(trade => trade.weId === req.body.weId)
  let index = trades.indexOf(check[0])

  trades = trades.splice(index, 1)

  worker = await Workers.findOneAndUpdate({ _id: req.body.uid }, { trades }, { new: true })
  res.send(worker)
})

router.post('/delete-ticket', async (req, res) => {
  let worker = await Workers.find({ _id: req.body.uid })
  worker = worker[0]
  if (!worker) return res.send('Something went wrong, please try again!')
  let tickets = worker.tickets

  let index = tickets.indexOf(req.body.ticket)
  tickets.splice(index, 1)

  worker = await Workers.findOneAndUpdate({ _id: req.body.uid }, { tickets }, { new: true })
  res.send(worker)
})

router.post('/upload-document/:id', upload.single('avatar'), async (req, res) => {
  console.log(req.file, req.params.id)
  let worker = await Workers.findOne({ _id: req.params.id })
  let documents

  if (worker.documents === undefined) {
    documents = []
  } else {
    documents = worker.documents
  }

  documents.push(req.file.path)

  let doc = await Workers.findOneAndUpdate({ _id: req.params.id }, { documents }, { new: true })

  res.send(doc)
})

router.post('/delete-document', async (req, res) => {
  let worker = await Workers.find({ _id: req.body.uid })
  worker = worker[0]
  if (worker === undefined) return res.send('Something went wrong, please try again!')
  let docs = worker.documents

  let index = docs.indexOf(req.body.doc)
  docs.splice(index, 1)

  worker = await Workers.findOneAndUpdate({ _id: req.body.uid }, { documents: docs }, { new: true })
  res.send(worker)
})

router.put('/added', async (req, res) => {
  let worker = await Workers.find({ _id: req.body.uid })
  if (worker.added !== undefined) return res.send(worker)

  worker = await Workers.findOneAndUpdate({ _id: req.body.id }, { added: req.body.added }, { new: true })

  res.send(worker)
})

router.delete('/delete', async (req, res) => {
  let worker = await Workers.findOneAndRemove({ _id: req.body.userId })

  res.send(worker)
})

module.exports = router;


