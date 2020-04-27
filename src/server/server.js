const server = require('./app')();
const port = process.env.PORT || 9999


const instantiated = server.listen(port, ()=>{
    console.log(`Server started at port http://localhost:${port}`)
})

var io = require('socket.io')(instantiated);
server.set('socketio', io);