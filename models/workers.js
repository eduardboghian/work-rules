const mongoose = require('mongoose');

const { Schema } = mongoose;

const Worker = new Schema({
    type: { type: String },
    companyName: { type: String },
    peer: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    uniqueID: { type: String },
    firstPost: { type: String },
    secondPost: { type: String },
    city: { type: String },
    zipCode: { type: String },
    utr: { type: String },
    vat: { type: String },
    nino: { type: String },
    phone: { type: String },
    phoneScnd: { type: String },
    email: { type: String },
    communicationChannel: { type: String },
    date: {
        type: Date,
        default: new Date()
    },
    comment: { type: String },
    category: { type: String },
    hours: { type: String },
    sortCode: { type: String },
    account: { type: Number },
    trades: { type: Array },
    tickets: { type: Array },
    status: { type: String },
    added: { type: String },
    documents: { type: Array }
});

module.exports = mongoose.model('workers', Worker, 'workers');
