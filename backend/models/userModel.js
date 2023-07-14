const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    avatar: {
        type: Boolean
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    primEmail: {
        type: String,
        unique: true,
        required: true
    },
    primPhone: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobPos: {
        type: String,
    },
    secPhone: {
        type: Number,
    },
    secEmail: {
        type: String,
    },
    bio: {
        type: String,
    },
    bday: {
        type: String,
    },
    meeting: {
        type: String
    },
    facebook: {
        type: String,
    },
    pinterest: {
        type: String,
    },
    twitter: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    google: {
        type: String,
    },
    online: {
        type: String,
    },
}, { collection: 'users' });

// Create a text index on firstName and lastName fields
dataSchema.index({ firstName: 'text', lastName: 'text' });

module.exports = mongoose.model('users', dataSchema);
