const socket = io();

socket.on('message', (msg) => {
    console.log(msg);
})

// add event listener to button to send message to server

var form = document.getElementById('myForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    var msg = document.getElementById('message').value;
    socket.emit('sendMessage', msg, (error,message) => {
        if(error){
            return console.log(error);
        }

        console.log(message);
    });
})


// add event listener to send message btn
document.getElementById("send-location").addEventListener('click',()=>{
    
    if(!navigator.geolocation){
        return alert("Geolocation is not supported in your browser! Sorry!!")
    }

    // get the location of user
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        
        // send location to server
        socket.emit('sendLocation', {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
        })
    })
})

