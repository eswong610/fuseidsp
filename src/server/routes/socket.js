const express= require('express');
const router = express.Router();
const Prompt = require('../models/Prompt').Prompt;
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User;
const Message = require('../models/Message').Message;
const Conversation = require('../models/Conversation').Conversation;


module.exports = function () {

    // router.use((req,res,next)=>{
    //     let io = req.app.get('socketio');
    //     next();
    // })
    
    //IT WORKS DNOT TOUCH THIS
    // //Socket.io for live chatting.
    // router.get('/message', ensureAuthenticated, (req,res)=>{
    //     console.log('from get /message');
        
    //     const users = {};

    //     User.findOne({username: req.user.username})
    //             .then((data)=>{
    //                 console.log(data['likedpeople'])
    //                 for (i of data['likedpeople']) {
    //                     rooms[i] = i
    //                 }
    //             })
    //             .catch((err)=>console.log(err));
        
        
    //       Prompt.findRandom({},{},{limit:3}, (err,data)=>{
    //         if (err) throw err;
    //         //console.log(data);
    //         //data[i]['prompt]
    //         res.render('messaging',{
    //             prompts: data,
                
    //         })
    //       })
        
    // });

    


    //Chat rooms 
    rooms = {}

    router.get('/rooms', ensureAuthenticated, (req,res)=>{
        
        Conversation.find({users: req.user.username})
            .then((data)=>{
                rooms[data[0].roomId] = data[0].roomId;
                console.log(rooms)
            })
            .catch((err)=>console.log(err))
       
        res.render('rooms', {rooms:rooms})
    })

    // router.post('/rooms', (req,res)=>{
    //     if (rooms[req.body.formroom] != null) {
    //         return res.redirect('/rooms')
    //     }
    //     console.log(req.body)
    //     rooms[req.body.formroom] = { users: {} }

    //     //Sends message that new room is created
        
    //     res.redirect(req.body.formroom);

    //     let io = req.app.get('socketio');
    //     io.emit('room-created', req.body.formroom)

    // })

    const privateUsers = {}


    router.post('/:room', ensureAuthenticated, (req,res)=>{
        // console.log(rooms[req.params.rooms])
        console.log(req.body);
        let newroom = req.body.msgroom;

        let toBeUser = (req.body.msgroom).replace(req.user.username, '');
        console.log('the other user' + toBeUser); //shows different usernames when 2 people logged in 
        

        // User.findOne({username:toBeUser})
        // .then((data)=>{

            privateUsers['otherUser'] = toBeUser;
            privateUsers['ownUser'] = req.user.username;
        // })
        // .catch((err)=>console.log(err));


        res.redirect(`/socket/${newroom}`)
    });

    
    router.get('/:room', ensureAuthenticated, (req,res)=>{
        if (rooms[req.params.room] == null) {
            User.findOne({username: req.user.username})
                .then((data)=>{
                    for (i of data['likedpeople']) {
                        roomName = i+req.user.username;
                        rooms[roomName] = i

                     
                    }
                })
                .catch((err)=>console.log(err));
        }
        
        let io = req.app.get('socketio');
        const users = {};
        
        if(io.sockets._events == undefined) {
            
            
            io.on('connection', socket => {
                
                
                
                
                // console.log('%s sockets connected', io.engine.clientsCount);
                socket.personalusername = req.user.username;
                console.log(socket.id + ' and ' + socket.personalusername + 'is connected');
                socket.otherUser = privateUsers['otherUser'];
                console.log(socket.personalusername);
                
                // console.log(socket.otherUser + ' is connected from te other side')

                // socket.on('chat message', (msg) => {
                //     io.emit('chat message', {msg:msg, name: users[socket.id]})
                //     console.log(`${socket.id} sent ${msg}`);
                // });

                socket.on('disconnect',()=>{
                    console.log('user disconnected')
                })

                socket.on('send chat message', message=>{
                    socket.broadcast.emit('chat message', {message:message, name: socket.otherUser})
                    console.log(`${socket.id} sent ${message}`);
                    console.log(`${socket.personalusername} sent ${message}`);

                    // const newMessage = new Message({
                    //     text: message,
                    //     sender: req.user.username,
                    //     receiver: socket.otherUser
                    // })
                    // newMessage.save()
                    // .then(data=>{
                    //     console.log(`${data.sender} sent ${data.text} to ${data.receiver}`)
                    // })
                    // .catch(err=>console.log(err))

                })

                socket.on('new-user',()=>{
                    
                    // let name = privateUsers['otherUser'];
                    // console.log('this is socket on new user ' + privateUsers['receiver'])
                    socket.broadcast.emit('user-connected', privateUsers['otherUser'])
                })

                socket.on('use-prompt', (prompt)=>{
                    io.emit('user-prompt', {prompt: prompt});
                    
                    
                })
            });
          }


        
        Prompt.findRandom({},{},{limit:3}, (err,data)=>{
            if (err) throw err;
            //console.log(data);
            //data[i]['prompt]
            res.render('messaging',{
                prompts: data,
                roomName: req.params.room,
            })
        })


    })



    return router
}
