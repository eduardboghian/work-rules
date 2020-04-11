const mongoose = require('mongoose');

const { Schema } = mongoose;

const Site = new Schema({
    siteName: { type: String },
    companyName: { type: String },
    workers: { type: Array },
});

module.exports = mongoose.model('sites', Site, 'sites');
