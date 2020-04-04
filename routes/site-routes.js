const express = require('express');
const jwt = require('jsonwebtoken');

const Clients = require('../models/clients');
const Sites = require('../models/sites')

const router = express.Router();

router.get('/get', (req, res) => {
    console.log('console req info', req.headers, req.body)
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
    console.log('console req info', req.headers, req.body)
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

module.exports = router;
