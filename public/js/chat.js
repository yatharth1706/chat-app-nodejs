const socket = io();
const $messageDiv = document.querySelector("#messages"); 
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// for parsing the query strign
const { username,room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const autoScroll = () => {
    // new message element
    const $newMessage = $messageDiv.lastElementChild;

    // height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight = $messageDiv.offsetHeight;

    // total height of container of messages when messages are more
    const containerHeight = $messageDiv.scrollHeight; // total height we are able to 
    // scroll through

    // how far i have scrolled

    const scrollOffset = $messageDiv.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messageDiv.scrollTop = $messageDiv.scrollHeight; 
    }

}   


socket.on('message', (msg) => {
    console.log(msg);

    // render the message template in web page
    const $html = Mustache.render(messageTemplate, {
        username: msg.username,
        message : msg.text,
        createdAt : moment(msg.createdAt).format("h:mm a")
    });
    console.log(typeof($html));
    $messageDiv.insertAdjacentHTML("beforeend",$html);
    autoScroll();
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
        }, (message) => {
            console.log(message);
        })
    })
})

socket.on("locationMessage", (message) => {
    
    // render this in a new template
    const locationHTML = Mustache.render(locationTemplate,{
        username: message.username,
        url : message.text,
        createdAt : moment(message.createdAt).format("h:mm a")
    });
    $messageDiv.insertAdjacentHTML("beforeend",locationHTML);

})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector("#sidebar").innerHTML = html;
})

socket.emit('join', { username, room }, (error) =>{
    if(error) {
        alert(error);
        // redirect to home page
        location.href = "/";
    }

})