const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    sender: {
        type: String,
    },
    receiver: {
        type: String,
    },
    message: {
        type: String,
    },
    time: {
        type: String,
    }
}, { collection: 'chats' });

module.exports = mongoose.model('chats', dataSchema);
