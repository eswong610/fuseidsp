const express= require('express');
const router = express.Router();

module.exports = function () {

    router.get('/usertest', (req,res)=>{
        res.render('profile/user_profile')
    })

    router.get('/personal', (req,res)=>{
        res.render('profile/personal_profile')
    })

    router.get('/settings', (req,res)=>{
        res.render('profile/settings')
    })

    return router
}