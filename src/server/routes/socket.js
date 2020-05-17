const express= require('express');
const router = express.Router();
const Prompt = require('../models/Prompt').Prompt;
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User;
const Message = require('../models/Message').Message;
const Conversation = require('../models/Conversation').Conversation;


module.exports = function () {

    const users= {};

    router.post('/sendmsg', (req,res)=>{
        let {receiverUsername} = req.body;
        users['receiver'] = receiverUsername;

        res.redirect('/socket/message/'+receiverUsername);
    })


    router.get('/message/:username', (req,res)=>{
        Prompt.findRandom({},{},{limit:3}, (err,data)=>{
            if (err) throw err;
            //console.log(data);
            //data[i]['prompt]
            res.render('messaging',{
                prompts: data,
                
            })
        })
        
    })

    router.post('/savemsg', ensureAuthenticated, (req,res)=>{
        const {content} = req.body;
        let sender = req.user.username;
        let receiver = users['receiver'];
        console.log(content + 'from ' + sender + ' to ' + receiver);
        
    })
    
   

    



    return router
}
