const server = require('./app')();
const port = process.env.PORT || 9999

server.listen(port, ()=>{
    console.log(`Server started at port http://localhost:${port}`)
})