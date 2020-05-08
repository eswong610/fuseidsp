const express= require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./public-controller')


const loggedIn = require('../../config/passport')

module.exports = function () {

    router.get('/find-people', ensureAuthenticated, (req,res)=>{
        
        res.render('profile/find-people')
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