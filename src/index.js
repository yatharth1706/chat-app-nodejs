const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const Filter = require('bad-words');

const port = process.env.PORT || 3000;
const io = socketio(server);
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log("New Web socket connection!!");
    socket.emit('message', "Welcome!!");
    socket.broadcast.emit('message',"A new user has joined!");

    socket.on('sendMessage', (msg, callback) => {
        // before emitting the message validate the message
        const filter = new Filter();
        if(filter.isProfane(msg)){
            return callback("Profanity is not allowed!!");
        }
        
        io.emit('message', msg);
        callback(null, "Delivered to everyone!!");
    });

    socket.on('sendLocation', (location) => {
        socket.broadcast.emit("message", `https://google.com/maps?q=${location.latitude},${location.longitude}`);
    });

    // when user disconnects

    socket.on('disconnect', () => {
        io.emit("message", "A user has left!");
    });

    
});


app.get('/',(req,res)=>{
    res.render("This is home page!!");
});

server.listen(port,()=>{
    console.log("Listening on port 3000!!!");
});

