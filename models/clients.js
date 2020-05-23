const mongoose = require('mongoose');

const { Schema } = mongoose;

const Client = new Schema({
    companyName: { type: String },
    peer: { type: String },
    name: { type: String },
    lastName: { type: String },
    firstPost: { type: String },
    secondPost: { type: String },
    city: { type: String },
    zipCode: { type: String },
    utr: { type: String },
    vat: { type: String },
    cis: { type: String },
    phoneScnd: { type: String },
    phone: { type: String },
    email: { type: String },
    comment: { type: String },
    companyComment: { type: String },
    communicationChannel: { type: String },
    sites: [{ 
        id: String,
        siteName: String,
        status: {
            type: String,
            default: 'Active'
        },
        comment: String
    }],
    status: { type: String },
});

module.exports = mongoose.model('clients', Client, 'clients');
