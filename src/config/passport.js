const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
//Load user model
const User = require('../server/models/User').User;

module.exports = function (passport) {
    passport.use(
        new LocalStrategy ((username, password, done)=>{
            
            //match User
            console.log(User);
            User.findOne({  
                username: username 
            }).then((user)=>{
                    console.log('from passport config' + user)
                    if (!user) {
                        return done(null, false, {message: 'That username does not exist'});
                    }
 
                    //Hashes password
                    bcrypt.compare(password, user.password, function(err, result) {
                        if (err) {
                            res.render('error', {err:err}) 
                        }else if (result) {
                            return done(null, user)
                        }else{
                            return done(null, false, {msg: 'Password does not match'})
                        }
                    })
                })
                .catch(err=>console.log('from passport' + err))
        })
    )

   

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}
