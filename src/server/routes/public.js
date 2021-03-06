const express = require('express');
const router = express.Router();
const User = require('../models/User').User
const Prompt = require('../models/Prompt').Prompt
const bcrypt = require('bcrypt')
const passport = require('passport')
const dotenv = require('dotenv').config({path: __dirname + '/../../../.env'})


module.exports = function(){


    router.get('/', (req, res)=>{  
        
        res.render('login')
    })     

    router.post('/login', (req, res, next) => {  
        passport.authenticate('local', {
          successRedirect: '/profile',
          failureRedirect: '/failure',
          failureFlash: true
        })(req, res, next); 
      }); 

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
      });

    router.get('/failure', (req,res)=>{
        res.render('failure');
    })

    
    router.get('/signup', (req,res)=>{
        res.render('signup_1_1', {
            errors:[]
        })
    })
    router.post('/signup', (req,res)=>{
       const {name, addressInp, usernameInp, passwordInp, passwordConfirmInp, provinceInp, countryInp, ageInp, cityInp, genderInp, interestedInInput} = req.body;       
       const errors = []
       

       if (!name || !addressInp || !usernameInp || !passwordInp || !passwordConfirmInp) {
           errors.push({msg: 'Please fill in all fields'})
           res.render('signup_1_1', {
               errors: errors
           })
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
            res.render('signup_1_1', {
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
                            age: ageInp,
                            gender: genderInp,
                            interestedInInput: interestedInInput

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

    // PROMPTS CODE 

    router.get('/ideaprompts', (req,res)=>{
        res.render('ideaprompt')
    })

    router.post('/ideaprompts', (req,res)=>{
        const {prompt} = req.body;
        Prompt.findOne({prompt: prompt})
            .then(data=>{
                if (data) {
                    res.send('already exists')
                }else{
                    const newPrompt = new Prompt({
                        prompt: prompt
                    })
                    newPrompt.save()
                    .then(data=>{
                        console.log(`"${data.prompt}" is saved`)
                        res.redirect('/ideaprompts')
                    })
                    .catch(err=>{
                        console.log(res.statusCode)
                        res.redirect('/ideaprompts');
                     
                    })
                }
            })

    })

    router.get('/randomprompt', (req,res)=>{
        User.findRandom({},{},{limit:3}, (err,data)=>{
            if (err) throw err;
            console.log(data);
            //data[i]['prompt]
            res.render('profile/find-people', {
              profiles: data  
            })
        })
    })



     router.get('/signup_confirmation', (req,res)=>{
        res.render('signup_confirmation');
    })

    //TEST ROUTES For easier times
    // router.get('/sampleexplore', (req,res)=>{
    //     res.render('profile/find-people')
    // })

    return router
}