const express= require('express');
const router = express.Router();

module.exports = function (io) {
    
    
    router.get('/message', (req,res)=>{
        let socket = req.app.get('socketio');
        socket.on('connection', (socket) => {
            console.log('a user connected');
          });
        res.render('messaging');
    })
    

    return router
}
