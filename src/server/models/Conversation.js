const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    roomId: {
        type: 'String',
        required: true
    },
    users:{
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = { Conversation }