const express= require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User


module.exports = function () {

    router.get('/find-people', ensureAuthenticated, (req,res)=>{
        User.findRandom({},{},{limit: 5}, (err, data)=>{
            if (err) throw err;
            res.render('profile/find-people', {
                profiles: data
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

    router.get('/settings', ensureAuthenticated, (req,res)=>{
        res.render('profile/settings')
    })

    return router
}