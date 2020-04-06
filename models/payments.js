const mongooose = require('mongoose')

const paymentSchema = new mongooose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String
    }
})

module.exports.Payments = mongooose.model('Payments', paymentSchema)