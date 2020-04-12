const mongoose = require('mongoose');

const { Schema } = mongoose;

const Worker = new Schema({
    type: { type: String },
    companyName: { type: String },
    peer: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    id: { type: String },
    firstPost: { type: String },
    secondPost: { type: String },
    city: { type: String },
    zipCode: { type: String },
    utr: { type: String },
    vat: { type: String },
    cis: { type: Boolean },
    nino: { type: String },
    phone: { type: String },
    email: { type: String },
    communicationChannel: { type: String },

    taxPercentage: { type: String },
    category: { type: String },
    hours: { type: Number },
    hoursOT: { type: Number },
    sortCode: { type: String },
    account: { type: Number },
    paymentStatus: {
        type: String,
        default: 'No'
    },
    status: { type: String },
});

module.exports = mongoose.model('workers', Worker, 'workers');
