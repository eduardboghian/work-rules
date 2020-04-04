const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Clients = require('../models/clients');

router.get('/get', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
            Clients.find({}).then(result => res.status(200).send(result));
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.post('/add', async (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }

        if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
            switch (req.body.action) {
                case 'edit':
                    Clients.findOneAndUpdate({ email: req.body.data.email }, req.body.data)
                        .then(result => res.status(200).send())
                        .catch(err => res.status(400).send());
                    res.status(200);
                    break;
                case 'create':
                    const item = new Clients(req.body.data);
                    item.save()
                        .then(result => res.status(200).send())
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

module.exports = router;
