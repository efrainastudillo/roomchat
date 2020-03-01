const debug = require('debug');

// Routes
const userRouter = require('./routes/user.routes');
const chatRouter = require('./routes/chat.routes');


const express = require('express');
// const http = require('http');
const config = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');


const app = express();
var bodyParser = require('body-parser')
const http = require('http').createServer(app);
const io = require('socket.io')(http);

debug.enable('chat:*');
const LOG = debug('chat:database');
config.config();

io.on('connection', (socket) => {
    const LOG = debug('chat:socket.io');
    LOG(`User connected ${socket.id}`);
    
    socket.on('chat', (msg) => {
        LOG(`Message received from client: ${msg}`);
        socket.broadcast.emit('chat', msg);
    });

    socket.on('disconnect', (event) => {
        LOG(` User disconnected ${event}`);
    });
});



app.use('/static', express.static('./public'));
// Configure Express to use EJS
app.set('views', path.join(process.env.ROOT_URL, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
// middleware to handle user routes
app.use('', userRouter);
app.use('', chatRouter);

options = { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
}
mongoose.connect(process.env.DBURI, options).then((data) => {
    LOG('Database connected!!!');
    http.listen(process.env.PORT, data => {
        LOG(`Server started on port ${process.env.PORT}.`);
    });
}).catch((err) => {
    LOG(`Error connecting Database - ${err}`);
});

