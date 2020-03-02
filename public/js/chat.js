$(document).ready(() => {
    const socket = io();
    socket.on('connection', () => {
        const user = localStorage.getItem('user');
        console.log('Userssss' +user.user.username);
        
    });
    const sendMessage = (message) => {
        $('#messages').append(`<p class='sent'><i class="fas fa-user"></i> ${message.msg} <span class='timestamp'>${message.timestamp}</span></p>`);
        socket.emit('chat', message); // send the message
    }
    const receiveMessage = (message) => {
        $('#messages').append(`<p class='received'><i class="fas fa-user"></i> ${message.msg} <span class='timestamp'>${message.timestamp}</span></p>`);
    }
    

    const sendMsgClick = (event) => {
        event.preventDefault();
        const data = { msg: $('#input-message').val(), timestamp: new Date() }; // Message to be sent to users
        sendMessage(data);
    };

    socket.on('chat', receiveMessage );
    socket.on('disconnect', () => {
        console.log('Server has disconnected...!!!');
    });
    $('#send-msg').on('click', sendMsgClick);
});