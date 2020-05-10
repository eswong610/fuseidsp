const mongoose = require('mongoose');
const random = require('mongoose-simple-random');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    bio: {
        type: String,
        maxlength: 250
    },
    smoking: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    political: {
        type: Boolean,
        default: false
    },
    religious: {
        type: Boolean,
        default: false
    },
    alcohol: {
        type: Boolean,
        default: false
    },
    traveller: {
        type: Boolean,
        default: false
    },
    marriage: {
        type: Boolean,
        default: false
    },
    casual:{
        type:Boolean,
        default: true
    }
})

UserSchema.plugin(random)

const User = mongoose.model('User', UserSchema);
module.exports = { User };