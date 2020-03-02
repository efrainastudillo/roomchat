const debug = require('debug');
const session = require('express-session');

// Routes
const userRouter = require('./routes/user.routes');
const chatRouter = require('./routes/chat.routes');


const express = require('express');
const config = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const redirectLogin = require('./helpers/user.helper').redirectLogin;

const app = express();
var bodyParser = require('body-parser')
const http = require('http').createServer(app);
const io = require('socket.io')(http);

debug.enable('chat:*');
const LOG = debug('chat:database');
config.config();

const https = require('https');
/**
 * Chat Room setup
 */
const bot = async (socket) => {

    const options = {
    hostname: 'whatever.com',
    port: 443,
    path: '/todos',
    method: 'GET'
    }

    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    });

    req.on('error', error => {
    console.error(error)
    })
    socket.broadcast.emit('chat', msg);
    req.end()
};
io.on('connection', (socket) => {
    const LOG = debug('chat:socket.io');
    LOG(`User connected ${socket.id}`);
    
    socket.on('chat', (msg) => {
        LOG(`Message received from client: ${msg}`);
        if(msg === 'hello'){
            socket.broadcast.emit('chat', 'Nigga this is a BOTOOOOOO');
        }
        socket.broadcast.emit('chat', msg);
    });

    socket.on('disconnect', (event) => {
        LOG(` User disconnected ${event}`);
    });
});

app.use('/static', express.static('./public'));
app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: process.env.PRIVATE_KEY,
    cookie: {
        maxAge: 1000*60*60,
        sameSite: true,
        secure: false
    }
}));
// Configure Express to use EJS
app.set('views', path.join(process.env.ROOT_URL, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('', userRouter); // i.e. login, signup routes
app.use('', redirectLogin, chatRouter); // chat route

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

