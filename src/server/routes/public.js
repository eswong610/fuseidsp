const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const passport = require('passport')
const dotenv = require('dotenv').config({path: __dirname + '/../../../.env'})


module.exports = function(){
    // router.get('/', (req, res)=>{
    //     res.send('hello world')
    // })

    router.get('/', (req, res)=>{  
        
        res.render('login')
    })     

    router.post('/login', (req, res, next) => {  
        console.log(req.body);

        passport.authenticate('local', {
          successRedirect: '/dashboard',
          failureRedirect: '/failure',
          failureFlash: true
        })(req, res, next); 
      }); 

    


    router.get('/signup', (req,res)=>{
        res.render('signup_1'); 
    })

    router.post('/signup', (req,res)=>{
       const {name, addressInp, usernameInp, passwordInp, passwordConfirmInp} = req.body;
       console.log(name, addressInp, passwordConfirmInp)
       const errors = []

       //check passwords 
    //    if (passwordInp.length < 8) {
    //        errors.push({ msg: 'Password must be 8 characters or longer'})
    //    }
       if (passwordInp !== passwordConfirmInp) {
            errors.push({ msg: 'Passwords Don\'t Match'})
       }
       console.log(errors)

    //    if (errors.length > 0) {
    //        res.render('error', )
    //    }else{
           //validated
           User.findOne({ usernameInp: usernameInp })
           .then((user)=>{
               if (user) {
                   res.send('error')
               }else{
                    const saltRounds = 10;
                    bcrypt.hash(passwordInp, saltRounds, function(err, hash) {
                        const hashedpassword = hash;
                        const newUser = new User({
                            name: name,
                            email: addressInp,
                            username: usernameInp,
                            password: hashedpassword,
                        })

                        newUser.save()
                            .then(user=>{
                                console.log(newUser)
                                req.flash('success_msg', 'You are now registered. Please log in.')
                                res.redirect('/')
                            })
                            .catch(err=>{console.log(err)})
                    });
               }
           })
           
       }
    )

    


    router.get('/signup_2', (req,res)=>{
        res.render('signup_2');
    })


    router.post('/signup', (req,res)=>{
        const {countryInp, provinceInp, cityInp, ageInp, genderInp} = req.body;
        
        res.redirect('/signup_confirmation')
     })


     router.get('/signup_confirmation', (req,res)=>{
        res.render('signup_confirmation');
    })

   

   


    return router
}