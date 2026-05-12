const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Username already exists'],
        required: [true, 'Username is required'],
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: [true, 'Account with this email already exists'],
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters long'],
        // Password is optional for users who sign in with Google.
        required: function () {
            return this.authProvider === 'local';
        },
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    googleId: {
        type: String,
        index: true,
        sparse: true,
    },
    avatar: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;