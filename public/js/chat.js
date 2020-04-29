const socket = io();

socket.on('countUpdated', (count) => {
    console.log("Count updated has been sent!! ", count)
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log("clicked")

    socket.emit('increment')
})

