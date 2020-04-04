const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
    username: { type: String },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },
    role: { type: String, required: true },
});

module.exports = mongoose.model('users', User, 'users');
