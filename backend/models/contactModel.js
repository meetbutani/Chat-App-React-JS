const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    owner: {
        type: String,
    },
    userName: {
        type: String,
    },
}, { collection: 'contacts' });

module.exports = mongoose.model('contacts', dataSchema);
