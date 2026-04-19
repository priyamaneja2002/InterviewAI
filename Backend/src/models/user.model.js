const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Username already exists'],
        required: [true, 'Username is required'],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: [true, 'Account with this email already exists'],
        required: [true, 'Email is required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;