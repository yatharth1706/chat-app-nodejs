const socket = io();

// add event listener to button to send message to server

var form = document.getElementById('myForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    var msg = document.getElementById('message').value;
    socket.emit('message', msg);
})

socket.on('message', (msg) => {
    console.log(msg);
})





