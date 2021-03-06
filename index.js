const express = require('express')
require('dotenv').config({ path: `${__dirname}/.env` })
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const cluster = require('cluster')

const app = express()
const apiPort = process.env.PORT || 3001

const db = require('./db')

const usersRouter = require('./routes/user-routes')
const clientsRouter = require('./routes/client-routes')
const sitesRouter = require('./routes/site-routes')
const workersRouter = require('./routes/worker-routes')
const generateInvoice = require('./routes/invoice-routes')
const weekly = require('./routes/weekly-routes')

const restartWeekEnding = require('./helpers/resetWeekEnding')

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads/', express.static('uploads'))
app.use(cors())
app.use(bodyParser.json())

app.get('/api', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', usersRouter)
app.use('/client', clientsRouter)
app.use('/site', sitesRouter)
app.use('/worker', workersRouter)
app.use('/api', generateInvoice)
app.use('/weekly', weekly)

// PINGER
app.get('/api', (req, res) => {
    res.send('pinged')
})

const pinger = require('./helpers/pinger')
pinger()

// BUILD THE CLIENT SIDE
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// CLUSTERING
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)
    // restartWeekEnding()
    db.on('error', console.error.bind(console, 'MongoDB connection error:'))

    for (let i = 0; i < 2; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    app.listen(apiPort)

    console.log(`Worker ${process.pid} started`)
}

//app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
