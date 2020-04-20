const mongoose = require('mongoose');

const { Schema } = mongoose;

const Client = new Schema({
    companyName: { type: String },
    peer: { type: String },
    id: { type: String },
    firstPost: { type: String },
    secondPost: { type: String },
    city: { type: String },
    zipCode: { type: String },
    utr: { type: String },
    vat: { type: String },
    cis: { type: Boolean },
    gross: { type: String },
    phone: { type: String },
    email: { type: String },
    communicationChannel: { type: String },
    sites: [{ 
        id: String,
        siteName: String,
        status: {
            type: String,
            default: 'Active'
        }
    }],
    status: { type: String },
});

module.exports = mongoose.model('clients', Client, 'clients');
