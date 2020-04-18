const mongoose = require('mongoose')

const weeklySchema = new mongoose.Schema({
    weekEnding: { type: String },
    data: { type: Object },
    date: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('WeeklyStatements', weeklySchema) 