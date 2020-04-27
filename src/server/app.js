const express = require('express');
const app = express();
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
// const dotenv = require('dotenv').config({path: '/.env'})
// {path: __dirname + '/../../../.env'}




module.exports = function(){

    // use routes folder
    const publicRouter = require('./routes/public')();
    const socketRouter = require('./routes/socket')();
    //DB Config
    //const db = process.env.MONGO_URI;
    const db = "mongodb+srv://admin:datingapp20@idspcluster-ebg6a.mongodb.net/test?retryWrites=true&w=majority"
    // const heroku_uri = "mongodb://heroku_5z1f7l4t:8frb4fh46qrhl385c6qhh7nlhj@ds263638.mlab.com:63638/heroku_5z1f7l4t"
    //Passport config
    require('../config/passport')(passport)
    // Connect to Mongo
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{
            console.log('MongoDB Database Connected')
        })
        .catch((err)=>{
            console.log(err)
        })

    //Front end
    app.use(express.static(path.join(__dirname, 'public')))
    app.set('view engine', 'ejs');

    app.set('views', path.join(__dirname, './views'));

    
    // cors origin URL - Allow inbound traffic from origin
    corsOptions = {
        origin: "Your FrontEnd Website URL",
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.use(cors(corsOptions));


    //body parser
    app.use(bodyParser.json());
    app.use(express.urlencoded({
      extended: true
    }))
    app.use(express.json())

    
    //Express Session
    app.use(session({
        secret: 'secret',//process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
      }))


     //passport
     app.use(passport.initialize());
     app.use(passport.session());

    //Connect flash
    app.use(flash())

    //global
    // app.use((req,res,next)=>{
    //     res.locals.sucess_msg= req.flash('success_msg');
    //     res.locals.error_msg= req.flash('error_msg');
    //     next();
    // })

   

    app.use('/', publicRouter)
    
    app.use('/', socketRouter)


    return app
}

