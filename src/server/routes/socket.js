const express= require('express');
const router = express.Router();
const Prompt = require('../models/Prompt').Prompt;
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User;
const Message = require('../models/Message').Message;
const Conversation = require('../models/Conversation').Conversation;


module.exports = function () {

    const users= {};
    console.log(users);
    router.post('/sendmsg', (req,res)=>{ // from other user's profile message button
        let {receiverUsername} = req.body;
        users['receiver'] = receiverUsername;

        res.redirect('/socket/message/'+receiverUsername);
    })


    router.get('/message/:username', ensureAuthenticated, (req,res)=>{
        let allmsgData ;
        let likedpeople;

        
        Message.find({sender:{$in : [req.user.username, users['receiver']]}, receiver:{$in: [req.user.username, users['receiver']]}})
            .then((data)=>{
                console.log(data);
                allmsgData = data;
                User.findOne({username: req.user.username})
                    .then((data)=>{
                    likedpeople = data.likedpeople;
                    

                    Prompt.findRandom({},{},{limit:3}, (err,data)=>{
                        if (err) throw err;
                        //console.log(data);
                        //data[i]['prompt]
                        res.render('messaging',{
                            prompts: data,
                            likedpeople : likedpeople,
                            pastMsg: allmsgData,
                            loggedIn : req.user.username,
                            //loggedInImg: req.user.img
                            
                        })
                    })

                })
            })
            .catch(err=>console.log(err))
        
        
    })

    router.post('/savemsg', ensureAuthenticated, (req,res)=>{
        const {content} = req.body;
        let sender = req.user.username;
        let receiver = users['receiver'];
        console.log(content + 'from ' + sender + ' to ' + receiver);

        const newMessage = new Message({
            text: content,
            sender: sender,
            receiver: receiver
        })
        newMessage.save()
            .then((data)=>{
                console.log('new message saved : ' + data)
            })
            .catch((err)=>console.log(err))

        receiver = '';
        
    })

    router.get('/rooms', ensureAuthenticated, (req,res)=>{
        let likedpeople;
        User.findOne({username:req.user.username})
            .then((data)=>{
                likedpeople = data.likedpeople;
                console.log(likedpeople)
                res.render('messaging', {
                    likedpeople: likedpeople,
                    prompts: null,
                    pastMsg: []
                })
            })
            .catch((err)=>console.log(err))
        
        
    })
    
   

    



    return router
}
