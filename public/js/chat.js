$(document).ready(() => {
    // console.log('Hello World');
    const socket = io();
    
    const sendMessage = (message) => {
        $('#messages').append(`<p class='sent'><i class="fas fa-user"></i> ${message}</p>`);
        socket.emit('chat', message); // send the message
    }
    const receiveMessage = (message) => {
        $('#messages').append(`<p class='received'><i class="fas fa-user"></i> ${message}</p>`);
    }
    

    const sendMsgClick = (event) => {
        event.preventDefault();
        const data = $('#input-message').val(); // Message to be sent to users
        sendMessage(data);
    };

    socket.on('chat', receiveMessage );
    socket.on('disconnect', () => {
        console.log('Server has disconnected...!!!');
    });
    $('#send-msg').on('click', sendMsgClick);
});