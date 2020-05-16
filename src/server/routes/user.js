const express= require('express');
const router = express.Router();
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User;
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv').config({path: __dirname + '/../../../.env'})
// let upload = multer({ dest: 'uploads/' })
// const bucket = `https://fuse2020.s3.us-east-2.amazonaws.com/${imagepath}`;


module.exports = function () {

    router.get('/find-people', ensureAuthenticated, (req,res)=>{
        let userInterest = req.user.interestedInInput
        let filter= {gender: {$in: userInterest}}
        User.findRandom(filter,{},{limit:100},(err, data)=>{
            if (err) throw err;
            //filters out user logged in 
            const otherpeople = [];
            for (i=0; i<data.length; i++) {
                console.log(data[i]['name'])
                if (data[i]['username'] !== req.user.username){
                    otherpeople.push(data[i]);
                }
            }

            // console.log(otherpeople);
            res.render('profile/find-people', {
                profiles: otherpeople,
            })
        })
    })

    router.get('/messages', (req,res)=>{
        res.render('messaging')
    })

    router.get('/profile', ensureAuthenticated, (req,res)=>{
        // console.log(req.user)
        res.render('profile/personal_profile', {
            username,
            age,
            name,
            bio,
            imageurl
        }=req.user)
    })

    //UPLOADING TO S3 BUCKET
    const s3 = new aws.S3({
        accessKeyId: process.env.S3_KEYID,
        secretAccessKey: process.env.S3_ACCESSKEY,
        Bucket: 'fuse2020'
       });
 


    const profileImgUpload = multer({
        storage: multerS3({
        s3: s3,
        bucket: 'fuse2020',
        acl: 'public-read',
        key: function (req, file, cb) {
        cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
        }
        }),
        limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    }).single('uploadedimg');


    router.post('/profile-img-upload',(req,res)=>{
      
        profileImgUpload( req, res, ( error ) => {
            if (error) {
                console.log(error)
            }else{
                if (req.file===undefined){
                    console.log('no file selected')
                }else{
                        const imageName = req.file.key;
                        const imageLocation = req.file.location;
                        console.log('name' + imageName);
                        console.log('location' + imageLocation);

                        User.updateOne(
                            {username: req.user.username},
                            {$set:{imageurl: imageLocation}},
                            )
                            .then((data)=>{
                                console.log('image url updated ' + data);
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                        
                        res.redirect('/profile')
                        }
                    }
        
            })
    })    


    //other users profile - found by username
    router.get('/users/:username', (req,res)=>{
        User.findOne({username: req.params.username})
            .then((data)=>{
                console.log(data);
                res.render('profile/user_profile', {
                    data: data
                })
            })
        // res.send(req.params.username + 'this is the profile you\'re looking for')
    })


    router.post('/bio-update', (req,res)=>{
        User.updateOne(
            {username : req.user.username}, 
            {$set:{'bio': req.body.biotext}}, 
            {upsert:true})
            .then((data)=>{
                console.log(`updated ${data}`)
            })
            .catch((err)=>{
                console.log(err)
            })
           
        res.redirect('/profile')
    })

    router.post('/liked_profile', (req,res)=>{
        let likedByUser = req.body.liked_profile;
        if (likedByUser) {
            likedByUser = likedByUser.substring(2);
            console.log(likedByUser);
        

        User.updateOne(
            {username:req.user.username},
            {$addToSet: {likedpeople: likedByUser}}
        )
        .then((data)=>{
            console.log(`likes updated ${data}`)
        })
        .catch((err)=>{
            console.log(err);
        })

        const newConversation = new Conversation({
            roomId: roomName,
            users: [req.user.username, i]
        })

        newConversation.save()
        .then((data)=>{console.log(data + 'conversation saved')})
        .catch(err=>console.log(err));
        

        
        // res.redirect('/find-people')
        }
    })

    router.get('/settings', ensureAuthenticated, (req,res)=>{
        res.render('profile/settings', {
            username,
            age
        }=req.user)
    })

    router.get('/help', (req,res)=>{
        res.render('profile/help')
    })

    router.get('/faq', (req,res)=>{
        res.render('profile/faq')
    })


    router.get('/privacy-policy', (req,res)=>{
        res.render('profile/privacy-policy')
    })

    




    return router
}