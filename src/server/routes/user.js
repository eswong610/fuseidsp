const express= require('express');
const router = express.Router();

module.exports = function () {

    router.get('/find-people', (req,res)=>{
        res.render('profile/find-people')
    })

    router.get('/messages', (req,res)=>{
        res.render('matched-message')
    })

    router.get('/profile', (req,res)=>{
        res.render('profile/personal_profile')
    })

    router.get('/settings', (req,res)=>{
        res.render('profile/settings')
    })

    return router
}