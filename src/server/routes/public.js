const express = require('express');
const router = express.Router();
const User = require('../models/User').User
const bcrypt = require('bcrypt')
const passport = require('passport')



module.exports = function(){
    // restrict routes 
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            console.log(`from if statement`, req.isAuthenticated())
                return next(); 
            } else{
                console.log(`from else`, req.isAuthenticated())
                res.redirect('/')
            }
        }

    router.get('/', (req, res)=>{  
        
        res.render('login')
    })     

    router.post('/login', (req, res, next) => {  
    
        passport.authenticate('local', {
          successRedirect: '/dashboard',
          failureRedirect: '/failure',
          failureFlash: true
        })(req, res, next); 
      }); 

    
    router.get('/signup', (req,res)=>{
        res.render('signup_1_1', {
            errors:[]
        })
    })
    router.post('/signup', (req,res)=>{
       const {name, addressInp, usernameInp, passwordInp, passwordConfirmInp, provinceInp, countryInp, ageInp, cityInp} = req.body;       
       const errors = []
       

       if (!name || !addressInp || !usernameInp || !passwordInp || !passwordConfirmInp) {
           errors.push({msg: 'Please fill in all fields'})
       }

    //    check passwords 
       if (passwordInp.length < 8) {
           errors.push({ msg: 'Password must be 8 characters or longer'})
       }
       if (passwordInp !== passwordConfirmInp) {
            errors.push({ msg: 'Passwords Don\'t Match'})
       }

       if (errors.length > 0) { 
            console.log(errors);
            res.render('signup_1', {
                errors: errors
            })
        }else{
            // all validated
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
                            country: countryInp,
                            province: provinceInp,
                            city: cityInp,
                            age: ageInp

                        })
                        newUser.save()
                            .then(user=>{
                                console.log(`signed up ${newUser.name}`)
                                res.render('signup_confirmation')
                            })
                            .catch(err=>{console.log(err)})
                    })
                    
                } 
                 
            })
        }
    })

    // router.get('/signup', (req,res)=>{
    //     res.render('signup_1', {
    //         errors: []
    //     }); 
    // })

    // router.post('/signup', (req,res)=>{
    //    const {name, addressInp, usernameInp, passwordInp, passwordConfirmInp} = req.body;
       
    //    const errors = []
       

    //    if (!name || !addressInp || !usernameInp || !passwordInp || !passwordConfirmInp) {
    //        errors.push({msg: 'Please fill in all fields'})
    //    }

    // //    check passwords 
    //    if (passwordInp.length < 8) {
    //        errors.push({ msg: 'Password must be 8 characters or longer'})
    //    }
    //    if (passwordInp !== passwordConfirmInp) {
    //         errors.push({ msg: 'Passwords Don\'t Match'})
    //    }
       
    //    if (errors.length > 0) {
    //        console.log(errors);
    //        res.render('signup_1', {
    //            errors: errors
    //        })
    //    }else{
    //        // all validated
    //        User.findOne({ usernameInp: usernameInp })
    //        .then((user)=>{
    //            if (user) {
    //                res.send('error')
    //            }else{
    //                 const saltRounds = 10;
    //                 bcrypt.hash(passwordInp, saltRounds, function(err, hash) {
    //                     const hashedpassword = hash;
    //                     const newUser = new User({
    //                         name: name,
    //                         email: addressInp,
    //                         username: usernameInp,
    //                         password: hashedpassword,
    //                     })
    //                     //saves to Mongodb
    //                     res.render('signup_2')
    //                     // newUser.save()
    //                     //     .then(user=>{
    //                     //         console.log(newUser)
    //                     //         res.render('/signup_confirmation')
    //                     //     })
    //                     //     .catch(err=>{console.log(err)})
    //                 });
    //            }
    //        })
           
    //    }
    // })

     router.get('/signup_confirmation', (req,res)=>{
        res.render('signup_confirmation');
    })


    // router.get('/testin333', (req,res)=>{
    //     res.render('messaging');
    // })

   
    
   


    return router
}