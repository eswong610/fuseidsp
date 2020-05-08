const mongoose = require('mongoose');
const random = require('mongoose-simple-random');

mongoose.set('useCreateIndex', true);

const PromptSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true,
        maxlength: 50
    },

})

PromptSchema.plugin(random)
    
const Prompt = mongoose.model('Prompt', PromptSchema);
module.exports = { Prompt }