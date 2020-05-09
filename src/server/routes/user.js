const express= require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User


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

            console.log(otherpeople);
            res.render('profile/find-people', {
                profiles: otherpeople,
            })
        })
    })

    router.get('/messages', ensureAuthenticated, (req,res)=>{
        res.render('matched-message')
    })

    router.get('/profile', ensureAuthenticated, (req,res)=>{
        console.log(req.user)
        res.render('profile/personal_profile', {
            username,
            age,
            name
        }=req.user)
    })


    //other users profile - found by username
    router.get('/:username', (req,res)=>{
        User.findOne({username: req.params.username})
            .then((data)=>{
                console.log(data);
                res.render('profile/user_profile', {
                    data: data
                })
            })
        // res.send(req.params.username + 'this is the profile you\'re looking for')
    })

    router.get('/settings', ensureAuthenticated, (req,res)=>{
        res.render('profile/settings')
    })

    router.get('/help', (req,res)=>{
        res.render('help')
    })

    router.get('/faq', (req,res)=>{
        res.render('faq')
    })


    router.get('/privacy-policy', (req,res)=>{
        res.render('privacy-policy')
    })




    return router
}