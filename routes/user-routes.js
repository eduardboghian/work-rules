const express = require('express');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ email: username, password });
    console.log(user, username, password)
    if (user) {
        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.status(200).send({ token, role: user.role });
        });
    } else {

        res.send("try again");
    }
});

router.get('/agents_sourcers', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.user.role === 'superuser') {
            Users.find({ role: { $in: ['agent', 'sourcer'] } }).then(result => {
                res.status(200).send(result);
            });
        } else {
            res.status(403).send("You don't have access");
        }
    });
});
router.post('/agents_sourcers', async (req, res) => {
    switch (req.body.action) {
        case 'edit':
            Users.findOneAndUpdate({ email: req.body.data.email }, req.body.data)
                .then(result => res.status(200).send())
                .catch(err => res.status(400).send());
            res.status(200);
            break;
        case 'create':
            const item = new Users(req.body.data);
            item.save()
                .then(result => res.status(200).send())
                .catch(err => res.status(400).send());
            break;
        default:
            break;
    }
});

module.exports = router;
