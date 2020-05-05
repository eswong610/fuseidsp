const express= require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./public-controller')
// const ensureAuthenticated = public.ensureAuthenticated

module.exports = function () {

    router.get('/find-people', ensureAuthenticated, (req,res)=>{

        res.render('profile/find-people')
    })

    router.get('/messages', ensureAuthenticated, (req,res)=>{
        res.render('matched-message')
    })

    router.get('/profile', ensureAuthenticated, (req,res)=>{
        res.render('profile/personal_profile')
    })

    router.get('/settings', ensureAuthenticated, (req,res)=>{
        res.render('profile/settings')
    })

    return router
}