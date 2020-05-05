const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');

const port = process.env.PORT || 3000;
const io = socketio(server);
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log("New Web socket connection!!");
    socket.emit('message', generateMessage("Welcome!"));
    socket.broadcast.emit('message',generateMessage("A new user has joined!"));

    socket.on('sendMessage', (msg, callback) => {
        // before emitting the message validate the message
        const filter = new Filter();
        if(filter.isProfane(msg)){
            return callback("Profanity is not allowed!!");
        }
        
        io.emit('message', generateMessage(msg));
        callback(null, "Delivered to everyone!!");
    });

    socket.on('sendLocation', (location, callback) => {
        io.emit("locationMessage", generateMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback("Location shared");
    });

    // when user disconnects

    socket.on('disconnect', () => {
        io.emit("message", generateMessage("A user has left!"));
    });

    
});


app.get('/',(req,res)=>{
    res.render("This is home page!!");
});

server.listen(port,()=>{
    console.log("Listening on port 3000!!!");
});

