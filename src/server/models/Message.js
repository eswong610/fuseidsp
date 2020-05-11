const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: {
        type: 'String',
        required: true
    },
    sender:{
        type: 'String',
        required: true
    },
    receiver:{
        type: 'String',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Message = mongoose.model('Message', MessageSchema);
module.exports = { Message }