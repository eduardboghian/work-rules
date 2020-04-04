const mongoose = require('mongoose');

const { Schema } = mongoose;

const Site = new Schema({
    siteName: { type: String },
    workers: [
        {
            _id: String,
            firstname: String,
            lastname: String,
        },
    ],
});

module.exports = mongoose.model('sites', Site, 'sites');
