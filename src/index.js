const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');


const port = process.env.PORT || 3000;
const io = socketio(server);
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log("New Web socket connection!!");

    socket.on("join", (options, callback)=>{
        const {error, user} = addUser({ id: socket.id, ...options });
        
        if(error){
            return callback(error);
        }


        socket.join(user.room);

        // io.to.emit for sending message to specific room
        // socket.broadcast.to.emit for sending message to specific room except username
        socket.emit('message', generateMessage(user.username,"Welcome!"));
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`));
        
        callback();
    });

    socket.on('sendMessage', (msg, callback) => {
        // before emitting the message validate the message
        const filter = new Filter();
        if(filter.isProfane(msg)){
            return callback("Profanity is not allowed!!");
        }
        
        // get user room
        const user = getUser(socket.id);

        if(user){
            io.to(user.room).emit('message', generateMessage(user.username,msg));
            callback(null, "Delivered to everyone!!");
        }
        
    });

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);

        if(user){
            io.to(user.room).emit("locationMessage", generateMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`));
            callback("Location shared");
        }
        
    });



    // when user disconnects

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit("message", generateMessage(`${user.username} has left!`));
        }

    });

    
});


app.get('/',(req,res)=>{
    res.render("This is home page!!");
});

server.listen(port,()=>{
    console.log("Listening on port 3000!!!");
});

