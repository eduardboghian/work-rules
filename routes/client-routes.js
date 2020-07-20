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

router.post('/get-by-name', async (req, res) => {
    let client = await Clients.find({ companyName: req.body.companyName })
    res.send(client)
})

router.post('/add', async (req, res) => {
    console.log(req.body)
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, 'secretkey', async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }

        if (authData.user.role === 'superuser' || authData.user.role === 'agent') {
            switch (req.body.action) {
                case 'edit':
                    Clients.findOneAndUpdate({ _id: req.body.data._id }, req.body.data)
                        .then(result => res.status(200).send('client edited successffuly...'))
                        .catch(err => res.status(400).send());
                    res.status(200);
                    break;
                case 'create':
                    delete req.body.data._id

                    const client = await Clients.findOne({ companyName: req.body.data.companyName })
                    console.log(client, 'lets seeee')
                    if (client) return res.status(400).send('A company with this name already exists...')

                    const item = new Clients(req.body.data);
                    item.save()
                        .then(result => res.status(200).send(result))
                        .catch(err => {
                            console.log(err)
                            res.status(400).send(err)
                        });
                    res.status(200)
                    break;
                default:
                    break;
            }
        } else {
            res.status(403).send("You don't have access");
        }
    });
});

router.put('/site-status', async (req, res) => {
    console.log(req.body)
    let client = await Clients.find({ _id: req.body.clientId })
    client = client[0]

    let site = client.sites.find(item => item._id == req.body.siteId)
    let index = client.sites

    site.status = req.body.value
    client.sites[index] = site


    client = await Clients.findOneAndUpdate({ _id: req.body.clientId }, client, { new: true })
    res.send(client)
})

router.delete('/delete-site', async (req, res) => {
    let client = await Clients.find({ _id: req.body.clientId })
    client = client[0]

    let site = client.sites.find(item => item._id == req.body.siteId)
    let index = client.sites.indexOf(site)

    client.sites.splice(index, 1)


    client = await Clients.findOneAndUpdate({ _id: req.body.clientId }, client, { new: true })
    res.send(client)
})

router.delete('/delete', async (req, res) => {
    let client = await Clients.findOneAndRemove({ _id: req.body.userId })

    res.send(client)
})

module.exports = router;
