const express= require('express');
const router = express.Router();

module.exports = function () {

    router.get('/usertest', (req,res)=>{
        res.render('profile/personal_profile')
    })

    return router
}