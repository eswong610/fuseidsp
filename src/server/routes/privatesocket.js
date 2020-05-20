const express= require('express');
const router = express.Router();
const Prompt = require('../models/Prompt').Prompt;
const { ensureAuthenticated } = require('./public-controller');
const User = require('../models/User').User;
const Message = require('../models/Message').Message;
const Conversation = require('../models/Conversation').Conversation;
const privateUsers = {};


module.exports = function () {


    router.get('/rooms', ensureAuthenticated, (req,res)=>{
        
        Conversation.find({users: req.user.username})
            .then((data)=>{
                rooms[data[0].roomId] = data[0].roomId;
                console.log(rooms)
            })
            .catch((err)=>console.log(err))
       
        res.render('rooms', {rooms:rooms})
    })


    router.get('/:room', ensureAuthenticated, (req,res)=>{
        let io = req.app.get('socketio');
        
        if(io.sockets._events == undefined) {
            io.on('connection', socket => {

                console.log(socket.id + ' is connected');
                socket.on('join',function(data) {
                    socket.join(data.username)
                })

                // socket.on('chat message', (msg) => {
                //     io.emit('chat message', {msg:msg, name: users[socket.id]})
                //     console.log(`${socket.id} sent ${msg}`);
                // });

                socket.on('disconnect',()=>{
                    console.log('user disconnected')
                })

                socket.on('send chat message', message=>{
                    socket.broadcast.emit('chat message', {message:message, name: users[socket.id]})
                    console.log(`${socket.id} sent ${message}`);
                     //comes up undefined
                    const newMessage = new Message({
                        text: message,
                        sender: req.user.username,
                        receiver: rooms[req.params.room] 
                    })
                    newMessage.save()
                    .then(data=>{
                        console.log(`${data.sender} sent ${data.text} to ${data.receiver}`)
                    })
                    .catch(err=>console.log(err))

                })

                socket.on('new-user',(name)=>{
                    privateUsers[req.user.username]= socket.id;
                    console.log(privateUsers);
                    socket.broadcast.emit('user-connected', name)
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

        // res.render('messaging', { 
        //     roomName: req.params.room
        // })
    })


    




    return router
}
