const express= require('express');
const router = express.Router();
const Prompt = require('../models/Prompt').Prompt


module.exports = function () {

    // router.use((req,res,next)=>{
    //     let io = req.app.get('socketio');
    //     next();
    // })
    
    //IT WORKS DNOT TOUCH THIS
    //Socket.io for live chatting.
    router.get('/message', (req,res)=>{

        let io = req.app.get('socketio');
        const users = {};
        
        if(io.sockets._events == undefined) {
            io.on('connection', socket => {
                // console.log('%s sockets connected', io.engine.clientsCount);
                console.log(socket.id + ' is connected');

                // socket.on('chat message', (msg) => {
                //     io.emit('chat message', {msg:msg, name: users[socket.id]})
                //     console.log(`${socket.id} sent ${msg}`);
                // });

                socket.on('disconnect',()=>{
                    socket.removeAllListeners();
                    console.log('user disconnected')
                })

                socket.on('send chat message', message=>{
                    socket.broadcast.emit('chat message', {message:message, name: users[socket.id]})
                    console.log(`${socket.id} sent ${message}`);
                })

                socket.on('new-user',(name)=>{
                    users[socket.id]= name;
                    socket.broadcast.emit('user-connected', name)
                })
            });
          }

        
        Prompt.findRandom({},{},{limit:3}, (err,data)=>{
            if (err) throw err;
            console.log(data);
            //data[i]['prompt]
            res.render('messaging')
        })
        


        // res.render('messaging')//, {
           //not sure about this....... 
            //javascript: "../public/js/messaging.js"
        //});
    });


    //test rooms 
    rooms = {trialroom : 'hello'}

    router.get('/rooms', (req,res)=>{
        res.render('rooms', {rooms:rooms})
    })

    router.post('/rooms', (req,res)=>{
        if (rooms[req.body.formroom] != null) {
            return res.redirect('/rooms')
        }
        console.log(req.body)
        rooms[req.body.formroom] = { users: {} }

        //Sends message that new room is created
        
        res.redirect(req.body.formroom);

        let io = req.app.get('socketio');
        io.emit('room-created', req.body.formroom)

    })

    router.get('/:room', (req,res)=>{
        if (rooms[req.params.room] == null) {
            res.redirect('rooms')
        }

        let io = req.app.get('socketio');
        const users = {};
        
        if(io.sockets._events == undefined) {
            io.on('connection', socket => {
                // console.log('%s sockets connected', io.engine.clientsCount);
                console.log(socket.id + ' is connected');

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
                })

                socket.on('new-user',(name)=>{
                    users[socket.id]= name;
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
