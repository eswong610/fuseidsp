const express= require('express');
const router = express.Router();

module.exports = function (io) {
    
    
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
        // io.on('connection', (socket) => {
            
        //     console.log(' %s sockets connected', io.engine.clientsCount);
        //     console.log(socket.id + ' is connected')
            
        //     socket.on('chat message', (msg) => {
        //         io.emit('chat message: ' + msg)
        //         console.log('message: ' + msg);
        //     });

        //     socket.on('disconnect',()=>{
        //         socket.removeAllListeners();
        //         console.log('user disconnected')
        //     })
        // });

        res.render('messaging');
    });

    

    return router
}
