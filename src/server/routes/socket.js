const express= require('express');
const router = express.Router();

module.exports = function () {
    
    //IT WORKS DNOT TOUCH THIS
    //Socket.io for live chatting.
    router.get('/message', (req,res)=>{
        let io = req.app.get('socketio');
        
        if(io.sockets._events == undefined) {
            io.on('connection', socket => {
                // console.log('%s sockets connected', io.engine.clientsCount);
                console.log(socket.id + ' is connected');

                socket.on('chat message', (msg) => {
                    io.emit('chat message', msg)
                    console.log(`${socket.id} sent ${msg}`);
                });

                socket.on('disconnect',()=>{
                    socket.removeAllListeners();
                    console.log('user disconnected')
                })
            });
          }
        res.render('messaging')//, {
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
        res.render('messaging', {
            roomName: req.params.room
        })
    })




    return router
}
