const express= require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User;
const Prompt = require('../models/Prompt').Prompt;
const Message = require('../models/Message').Message;


module.exports = function () {

    router.get('/find-people', ensureAuthenticated, (req,res)=>{
        User.findRandom({},{},{limit:100},(err, data)=>{
            if (err) throw err;
            //filters out user logged in 
            const otherpeople = [];
            for (i=0; i<data.length; i++) {
                console.log(data[i]['name'])
                if (data[i]['username'] !== req.user.username){
                    otherpeople.push(data[i]);
                }
            }

            // console.log(otherpeople);
            res.render('profile/find-people', {
                profiles: otherpeople,
            })
        })
    })

    router.get('/messages', ensureAuthenticated, (req,res)=>{
        res.render('matched-message')
    })

    router.get('/profile', ensureAuthenticated, (req,res)=>{
        // console.log(req.user)
        res.render('profile/personal_profile', {
            username,
            age,
            name,
            bio
        }=req.user)
    })


    //other users profile - found by username
    router.get('/users/:username', (req,res)=>{
        User.findOne({username: req.params.username})
            .then((data)=>{
                console.log(data);
                res.render('profile/user_profile', {
                    data: data
                })
            })
        // res.send(req.params.username + 'this is the profile you\'re looking for')
    })

    const chattingTo = {}

    router.get('/users/message/:username', (req,res)=>{

        chattingTo['user'] = req.params.username

        Prompt.findRandom({},{},{limit:3}, (err,data)=>{
            if (err) throw err;
            //console.log(data);
            //data[i]['prompt]
            res.render('staticmsg',{
                prompts: data,
                chattingTo: req.params.username
                
            })
          })

    })

    router.post('/staticmessage', ensureAuthenticated, (req,res)=>{
        
        const newMessage = new Message({
            text: message['message'],
            sender: req.user.username,
            receiver: chattingTo['user']
        })
        newMessage.save()
        .then(data=>{
            console.log(`${data.sender} sent ${data.text} to ${data.receiver}`)
        })
        .catch(err=>console.log(err));
        res.redirect('/users/message/'+chattingTo['user'])
    })
    


    router.post('/bio-update', (req,res)=>{
        User.updateOne(
            {username : req.user.username}, 
            {$set:{'bio': req.body.biotext}}, 
            {upsert:true})
            .then((data)=>{
                console.log(`updated ${data}`)
            })
            .catch((err)=>{
                console.log(err)
            })
           
        res.redirect('/profile')
    })

    router.post('/liked_profile', (req,res)=>{
        let likedByUser = req.body.liked_profile;
        if (likedByUser) {
            likedByUser = likedByUser.substring(2);
        // console.log(likedByUser.substring(2))
        

        User.updateOne(
            {username:req.user.username},
            {$addToSet: {likedpeople: likedByUser}}
        )
        .then((data)=>{
            console.log(`updated ${data}`)
        })
        .catch((err)=>{
            console.log(err);
        })
        // res.redirect('/find-people')
        }
    })

    router.get('/settings', ensureAuthenticated, (req,res)=>{
        res.render('profile/settings')
    })

    router.get('/help', (req,res)=>{
        res.render('profile/help')
    })

    router.get('/faq', (req,res)=>{
        res.render('profile/faq')
    })


    router.get('/privacy-policy', (req,res)=>{
        res.render('profile/privacy-policy')
    })

    




    return router
}