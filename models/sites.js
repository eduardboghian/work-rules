const mongoose = require('mongoose');

const { Schema } = mongoose;

const Site = new Schema({
    siteName: { type: String },
    companyName: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    zipCode: { type: String },
    workers: { type: Array },
    status: {
        type: String,
        default: 'Active'
    },
    comment: String
});

module.exports = mongoose.model('sites', Site, 'sites');
