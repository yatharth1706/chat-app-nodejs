const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);


const port = process.env.PORT || 3000;
const io = socketio(server);
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath))

io.on('connection', () => {
    console.log("New Web socket connection!!");
    
})


app.get('/',(req,res)=>{
    res.render("This is home page!!");
})

server.listen(port,()=>{
    console.log("Listening on port 3000!!!");
})

