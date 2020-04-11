const mongoose = require('mongoose')

const weeklySchema = new mongoose.Schema({
    weekEnding: { type: String },
    data: { type: Object }
})

module.exports = mongoose.model('WeeklyStatements', weeklySchema) 